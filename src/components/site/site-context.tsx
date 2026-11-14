"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ProgramDTO, SiteSettingsDTO, UniversityDTO } from "@/lib/types";

export const MAX_COMPARE = 3;

export type ModalState =
  | { type: "lead"; title: string; source: "counseling" | "brochure" | "apply" | "quiz"; universityId?: string }
  | { type: "fees"; universityId: string }
  | { type: "compare" }
  | { type: "quiz" }
  | null;

type Ctx = {
  universities: UniversityDTO[];
  programs: ProgramDTO[];
  settings: SiteSettingsDTO;
  byId: Map<string, UniversityDTO>;
  compare: string[];
  toggleCompare: (id: string) => void;
  removeCompare: (id: string) => void;
  clearCompare: () => void;
  modal: ModalState;
  openModal: (m: ModalState) => void;
  closeModal: () => void;
  toast: string | null;
  showToast: (msg: string) => void;
};

const SiteCtx = createContext<Ctx | null>(null);

export function useSite() {
  const c = useContext(SiteCtx);
  if (!c) throw new Error("useSite must be used inside SiteProvider");
  return c;
}

const STORAGE_KEY = "bge_compare";

export function SiteProvider({
  universities,
  programs,
  settings,
  children,
}: {
  universities: UniversityDTO[];
  programs: ProgramDTO[];
  settings: SiteSettingsDTO;
  children: React.ReactNode;
}) {
  const byId = useMemo(() => new Map(universities.map((u) => [u.id, u])), [universities]);
  const [compare, setCompare] = useState<string[]>([]);
  const [modal, setModal] = useState<ModalState>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Restore compare list (only ids that still exist).
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
      setCompare(saved.filter((id) => byId.has(id)).slice(0, MAX_COMPARE));
    } catch {}
  }, [byId]);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compare));
    } catch {}
  }, [compare]);

  // Lock body scroll while a modal is open + close on Escape.
  useEffect(() => {
    if (!modal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setModal(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [modal]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((t) => (t === msg ? null : t)), 3000);
  }, []);

  const toggleCompare = useCallback(
    (id: string) => {
      setCompare((prev) => {
        if (prev.includes(id)) return prev.filter((x) => x !== id);
        if (prev.length >= MAX_COMPARE) {
          showToast(`You can compare up to ${MAX_COMPARE} universities at a time.`);
          return prev;
        }
        return [...prev, id];
      });
    },
    [showToast],
  );

  const value: Ctx = {
    universities,
    programs,
    settings,
    byId,
    compare,
    toggleCompare,
    removeCompare: (id) => setCompare((p) => p.filter((x) => x !== id)),
    clearCompare: () => setCompare([]),
    modal,
    openModal: setModal,
    closeModal: () => setModal(null),
    toast,
    showToast,
  };

  return <SiteCtx.Provider value={value}>{children}</SiteCtx.Provider>;
}
