"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Loader2, Lock } from "lucide-react";
import { submitLead } from "@/app/actions/leads";
import type { LeadInput } from "@/lib/validation";
import { useSite } from "./site-context";

const QUALIFICATIONS = [
  "Graduate (Final Year / Completed)",
  "12th Pass",
  "Diploma",
  "Post Graduate",
  "Working Professional",
];

type Variant = "modal" | "expert";

export function LeadForm({
  source,
  universityId,
  variant = "modal",
  submitLabel = "Get Brochure & Free Call Back",
  onDone,
}: {
  source: LeadInput["source"];
  universityId?: string;
  variant?: Variant;
  submitLabel?: string;
  onDone?: () => void;
}) {
  const { programs, settings } = useSite();
  const [pending, start] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const dark = variant === "expert";

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => (fd.get(k) as string | null) ?? undefined;
    setErrors({});
    setFormError(null);
    start(async () => {
      const res = await submitLead({
        name: get("name") ?? "",
        phone: get("phone") ?? "",
        email: get("email"),
        qualification: get("qualification"),
        course: get("course"),
        location: get("location"),
        company: get("company"),
        source,
        universityId,
      });
      if (res.ok) setDone(true);
      else {
        setErrors(res.fieldErrors ?? {});
        setFormError(res.error);
      }
    });
  }

  if (done) {
    return (
      <div className={`py-6 text-center ${dark ? "text-white" : ""}`}>
        <CheckCircle2 className="mx-auto size-14 text-green-500" />
        <h4 className={`mt-3 font-display text-xl font-bold ${dark ? "text-white" : "text-navy"}`}>Request received!</h4>
        <p className={`mt-2 text-sm ${dark ? "text-white/75" : "text-slate-600"}`}>
          A senior admission counsellor will call you shortly. For urgent help call {settings.phone}.
        </p>
        {onDone && (
          <button onClick={onDone} className="btn-navy mt-5 text-sm">
            Close
          </button>
        )}
      </div>
    );
  }

  const label = dark ? "mb-1.5 block text-sm font-semibold text-white/90" : "label";
  const field = dark
    ? "w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-[15px] text-white placeholder:text-white/40 outline-none focus:border-brand"
    : "field";
  const err = (k: string) =>
    errors[k] ? <p className="mt-1 text-xs font-medium text-red-500">{errors[k]}</p> : null;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {/* honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div>
        <label className={label} htmlFor={`${variant}-name`}>
          {dark ? "Full Name" : "Student Full Name"} <span className="text-brand">*</span>
        </label>
        <input id={`${variant}-name`} name="name" required placeholder={dark ? "Enter your full name" : "e.g., Rahul Sharma"} className={field} autoComplete="name" />
        {err("name")}
      </div>

      <div>
        <label className={label} htmlFor={`${variant}-phone`}>
          {dark ? "Mobile Number (WhatsApp)" : "Mobile / WhatsApp Number"} <span className="text-brand">*</span>
        </label>
        <input id={`${variant}-phone`} name="phone" required inputMode="numeric" maxLength={14} placeholder="10-digit mobile number" className={field} autoComplete="tel-national" />
        {err("phone")}
      </div>

      {dark ? (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label} htmlFor="expert-course">Preferred Course</label>
            <select id="expert-course" name="course" className={`${field} [&>option]:text-slate-900`} defaultValue={programs[0]?.name}>
              {programs.map((p) => (
                <option key={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="expert-location">State / City</label>
            <input id="expert-location" name="location" placeholder="e.g., Delhi, UP, MH" className={field} />
          </div>
        </div>
      ) : (
        <>
          <div>
            <label className={label} htmlFor="modal-email">Email Address</label>
            <input id="modal-email" name="email" type="email" placeholder="rahul@example.com" className={field} autoComplete="email" />
            {err("email")}
          </div>
          <div>
            <label className={label} htmlFor="modal-qualification">Highest Qualification</label>
            <select id="modal-qualification" name="qualification" className={field} defaultValue={QUALIFICATIONS[0]}>
              {QUALIFICATIONS.map((q) => (
                <option key={q}>{q}</option>
              ))}
            </select>
          </div>
        </>
      )}

      {formError && !Object.keys(errors).length && <p className="text-sm font-medium text-red-500">{formError}</p>}

      <button type="submit" disabled={pending} className="btn-brand w-full py-3.5">
        {pending && <Loader2 className="size-4 animate-spin" />}
        {submitLabel}
      </button>

      {dark && (
        <p className="flex items-center justify-center gap-1.5 text-[12px] text-white/60">
          <Lock className="size-3 text-green-400" /> Your details are 100% safe &amp; never spammed.
        </p>
      )}
    </form>
  );
}
