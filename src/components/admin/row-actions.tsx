"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { deleteUniversity, toggleUniversity } from "@/app/admin/actions";

export function RowActions({ id, active, editHref, name }: { id: string; active: boolean; editHref: string; name: string }) {
  const [pending, start] = useTransition();
  const btn = "grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-navy disabled:opacity-40";
  return (
    <div className="flex justify-end gap-1">
      <Link href={editHref} className={btn} title="Edit"><Pencil className="size-4" /></Link>
      <button disabled={pending} className={btn} title={active ? "Hide from website" : "Show on website"} onClick={() => start(() => toggleUniversity(id))}>
        {active ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
      <button
        disabled={pending}
        className={`${btn} hover:!text-red-600`}
        title="Delete"
        onClick={() => {
          if (confirm(`Delete "${name}"? Its leads are kept but unlinked.`)) start(() => deleteUniversity(id));
        }}
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
