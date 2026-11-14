"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import type { LeadStatus } from "@prisma/client";
import { deleteLead, updateLead } from "@/app/admin/actions";
import { STATUS_STYLES } from "./ui";

const STATUSES: LeadStatus[] = ["NEW", "CONTACTED", "INTERESTED", "ENROLLED", "CLOSED"];

type L = {
  id: string; name: string; phone: string; email: string | null; qualification: string | null; course: string | null;
  location: string | null; source: string; status: LeadStatus; notes: string | null; universityName: string | null; createdAt: string;
};

export function LeadRow({ lead }: { lead: L }) {
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [pending, start] = useTransition();
  const dirty = status !== lead.status || notes !== (lead.notes ?? "");

  return (
    <tr className="align-top">
      <td className="px-4 py-3">
        <p className="font-semibold text-slate-900">{lead.name}</p>
        <a href={`tel:${lead.phone}`} className="block text-navy hover:underline">{lead.phone}</a>
        <a href={`https://wa.me/91${lead.phone}`} target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 hover:underline">WhatsApp ↗</a>
        {lead.email && <a href={`mailto:${lead.email}`} className="block text-xs text-slate-500 hover:underline">{lead.email}</a>}
      </td>
      <td className="px-4 py-3 text-xs text-slate-600">
        {lead.universityName && <p className="font-semibold text-slate-800">{lead.universityName}</p>}
        {lead.course && <p>Course: {lead.course}</p>}
        {lead.qualification && <p>{lead.qualification}</p>}
        {lead.location && <p>{lead.location}</p>}
      </td>
      <td className="px-4 py-3 capitalize text-slate-600">{lead.source.replace("-", " ")}</td>
      <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">{lead.createdAt}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <select value={status} onChange={(e) => setStatus(e.target.value as LeadStatus)} className={`rounded-md border-0 px-2 py-1 text-xs font-bold ${STATUS_STYLES[status]}`}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          {dirty && (
            <button disabled={pending} onClick={() => start(() => updateLead(lead.id, status, notes))} className="rounded-md bg-navy px-2.5 py-1 text-xs font-semibold text-white">
              {pending ? "Saving…" : "Save"}
            </button>
          )}
          <button
            disabled={pending}
            onClick={() => confirm(`Delete lead "${lead.name}"?`) && start(() => deleteLead(lead.id))}
            className="ml-auto text-slate-300 hover:text-red-600"
            title="Delete lead"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Add notes…" className="mt-2 w-full min-w-48 rounded-md border border-slate-200 px-2 py-1 text-xs" />
      </td>
    </tr>
  );
}
