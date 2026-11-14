"use client";

import { useActionState } from "react";
import { addAdmin, changePassword, saveSettings } from "@/app/admin/actions";
import { StatusMsg } from "./ui";

type S = { phone: string; whatsapp: string; email: string; address: string; helplineHours: string; leadNotifyTo: string };

const fields: { name: keyof S; label: string; hint?: string }[] = [
  { name: "phone", label: "Helpline phone" },
  { name: "helplineHours", label: "Helpline hours" },
  { name: "whatsapp", label: "WhatsApp number", hint: "Digits with country code, e.g. 919876543210" },
  { name: "email", label: "Public email" },
  { name: "address", label: "Address" },
  { name: "leadNotifyTo", label: "Send new-lead emails to", hint: "Resend notifies this inbox for every enquiry" },
];

export function SettingsForm({ s }: { s: S }) {
  const [state, action, pending] = useActionState(saveSettings, null);
  return (
    <form action={action} className="space-y-4">
      {fields.map((f) => (
        <div key={f.name}>
          <label className="label" htmlFor={f.name}>{f.label}</label>
          <input id={f.name} name={f.name} defaultValue={s[f.name]} required className="field" />
          {f.hint && <p className="mt-1 text-xs text-slate-400">{f.hint}</p>}
        </div>
      ))}
      <div className="flex items-center gap-3">
        <button disabled={pending} className="btn-navy text-sm">Save settings</button>
        <StatusMsg state={state} />
      </div>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, null);
  return (
    <form action={action} className="space-y-3">
      <input name="current" type="password" required placeholder="Current password" autoComplete="current-password" className="field" />
      <input name="next" type="password" required minLength={8} placeholder="New password (8+ chars)" autoComplete="new-password" className="field" />
      <div className="flex items-center gap-3">
        <button disabled={pending} className="btn-navy text-sm">Update password</button>
        <StatusMsg state={state} />
      </div>
    </form>
  );
}

export function AddAdminForm() {
  const [state, action, pending] = useActionState(addAdmin, null);
  return (
    <form action={action} className="grid gap-3 sm:grid-cols-3">
      <input name="name" required placeholder="Name" className="field" />
      <input name="email" type="email" required placeholder="Email" className="field" />
      <input name="password" type="password" required minLength={8} placeholder="Password" autoComplete="new-password" className="field" />
      <div className="flex items-center gap-3 sm:col-span-3">
        <button disabled={pending} className="btn-brand text-sm">Add admin</button>
        <StatusMsg state={state} />
      </div>
    </form>
  );
}
