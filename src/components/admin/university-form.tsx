"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { saveUniversity } from "@/app/admin/actions";
import { Card, StatusMsg } from "./ui";

type Initial = {
  id: string; name: string; shortName: string; slug: string; initials: string; logoColor: string; logoUrl: string | null;
  city: string; state: string; ugcDeb: boolean; naacGrade: string | null; nirfRank: string | null; wesAccredited: boolean;
  featuredProgram: string; duration: string; courseTags: string[]; totalFee: number; semesterFee: number; emiPerMonth: number;
  examMode: string; specializations: string; hiringPartners: string; highlights: string[]; brochureUrl: string | null;
  applyUrl: string | null; popularity: number; active: boolean; programIds: string[];
};

function F({ label, name, hint, className = "", ...props }: { label: string; name: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label className="label" htmlFor={name}>{label}</label>
      <input id={name} name={name} className="field" {...props} />
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

function Check({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="size-4 accent-navy" /> {label}
    </label>
  );
}

export function UniversityForm({ programs, initial }: { programs: { id: string; name: string }[]; initial?: Initial }) {
  const [state, action, pending] = useActionState(saveUniversity, null);
  const i = initial;

  return (
    <form action={action} className="space-y-6">
      {i && <input type="hidden" name="id" value={i.id} />}

      <Card>
        <h2 className="mb-4 font-bold">Basic details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <F label="Full name *" name="name" required defaultValue={i?.name} placeholder="Amity University Online" />
          <F label="Short name (compare tray) *" name="shortName" required defaultValue={i?.shortName} placeholder="Amity (AU)" />
          <F label="URL slug" name="slug" defaultValue={i?.slug} hint="Leave empty to generate from name" />
          <div className="grid grid-cols-[1fr_auto] gap-3">
            <F label="Logo initials *" name="initials" required maxLength={6} defaultValue={i?.initials} placeholder="AU" />
            <div>
              <label className="label" htmlFor="logoColor">Logo colour</label>
              <input id="logoColor" type="color" name="logoColor" defaultValue={i?.logoColor ?? "#0b2350"} className="h-[50px] w-16 cursor-pointer rounded-xl border border-slate-200" />
            </div>
          </div>
          <F label="Logo image URL (optional)" name="logoUrl" type="url" defaultValue={i?.logoUrl ?? ""} hint="Overrides the initials badge" className="md:col-span-2" />
          <F label="City *" name="city" required defaultValue={i?.city} />
          <F label="State *" name="state" required defaultValue={i?.state} />
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 font-bold">Approvals &amp; ranking</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <F label="NAAC grade" name="naacGrade" defaultValue={i?.naacGrade ?? ""} placeholder="A+, A++" />
          <F label="NIRF rank" name="nirfRank" defaultValue={i?.nirfRank ?? ""} placeholder="#32 or Top 50" />
          <F label="Popularity (sort order)" name="popularity" type="number" defaultValue={i?.popularity ?? 50} hint="Higher shows first" />
        </div>
        <div className="mt-4 flex flex-wrap gap-6">
          <Check name="ugcDeb" label="UGC-DEB approved" defaultChecked={i?.ugcDeb ?? true} />
          <Check name="wesAccredited" label="WES accredited" defaultChecked={i?.wesAccredited} />
          <Check name="active" label="Live on website" defaultChecked={i?.active ?? true} />
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 font-bold">Program &amp; fees</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <F label="Featured program *" name="featuredProgram" required defaultValue={i?.featuredProgram} placeholder="Online MBA (20+ Specializations)" />
          <F label="Duration *" name="duration" required defaultValue={i?.duration} placeholder="2 Years (4 Semesters)" />
          <F label="Course tags" name="courseTags" defaultValue={i?.courseTags.join(", ")} placeholder="MBA, MCA, BBA, BCA" hint="Comma-separated, shown as chips on the card" className="md:col-span-2" />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <F label="Total course fee (₹) *" name="totalFee" type="number" min={0} required defaultValue={i?.totalFee} />
          <F label="Per-semester fee (₹) *" name="semesterFee" type="number" min={0} required defaultValue={i?.semesterFee} />
          <F label="No-cost EMI / month (₹) *" name="emiPerMonth" type="number" min={0} required defaultValue={i?.emiPerMonth} />
        </div>
        <div className="mt-4">
          <p className="label">Listed under programs (filter chips)</p>
          <div className="flex flex-wrap gap-2">
            {programs.map((p) => (
              <label key={p.id} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm has-[:checked]:border-navy has-[:checked]:bg-navy-50">
                <input type="checkbox" name="programIds" value={p.id} defaultChecked={i?.programIds.includes(p.id)} className="accent-navy" />
                {p.name}
              </label>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 font-bold">Comparison details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <F label="Exam mode" name="examMode" defaultValue={i?.examMode ?? "Online Proctored (From Home)"} />
          <F label="Key specializations" name="specializations" defaultValue={i?.specializations} placeholder="Finance, Marketing, HR…" />
          <F label="Top hiring partners" name="hiringPartners" defaultValue={i?.hiringPartners} placeholder="TCS, Accenture, Amazon…" />
          <F label="Key highlights" name="highlights" defaultValue={i?.highlights.join(", ")} hint="Comma-separated, shown in Fee Details" />
          <F label="Brochure URL" name="brochureUrl" type="url" defaultValue={i?.brochureUrl ?? ""} />
          <F label="Official apply URL" name="applyUrl" type="url" defaultValue={i?.applyUrl ?? ""} />
        </div>
      </Card>

      <div className="flex items-center gap-4">
        <button disabled={pending} className="btn-navy">
          {pending && <Loader2 className="size-4 animate-spin" />} {i ? "Save changes" : "Add university"}
        </button>
        <Link href="/admin/universities" className="text-sm font-semibold text-slate-500">Cancel</Link>
        <StatusMsg state={state} />
      </div>
    </form>
  );
}
