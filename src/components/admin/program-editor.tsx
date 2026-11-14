"use client";

import { useActionState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteProgram, saveProgram } from "@/app/admin/actions";
import { PROGRAM_ICON_NAMES, ProgramIcon } from "@/components/site/icons";
import { Card, StatusMsg } from "./ui";

type P = { id: string; name: string; icon: string; duration: string; sortOrder: number; active: boolean; count: number };

function Row({ p }: { p?: P }) {
  const [state, action, pending] = useActionState(saveProgram, null);
  const [delPending, start] = useTransition();
  return (
    <form action={action} key={p?.id ?? "new"} className="grid items-end gap-3 border-b border-slate-100 py-3 last:border-0 md:grid-cols-[2fr_1.3fr_1.3fr_80px_auto_auto]">
      {p && <input type="hidden" name="id" value={p.id} />}
      <div>
        <label className="label text-xs">Name</label>
        <input name="name" required defaultValue={p?.name} placeholder="Online MSc" className="field py-2" />
      </div>
      <div>
        <label className="label text-xs">Icon</label>
        <div className="flex items-center gap-2">
          <ProgramIcon name={p?.icon ?? "GraduationCap"} className="size-5 shrink-0 text-brand" />
          <select name="icon" defaultValue={p?.icon ?? "GraduationCap"} className="field py-2">
            {PROGRAM_ICON_NAMES.map((n) => <option key={n}>{n}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="label text-xs">Duration</label>
        <input name="duration" required defaultValue={p?.duration ?? "2 Years"} className="field py-2" />
      </div>
      <div>
        <label className="label text-xs">Order</label>
        <input name="sortOrder" type="number" defaultValue={p?.sortOrder ?? 99} className="field py-2" />
      </div>
      <label className="flex items-center gap-2 pb-2.5 text-sm">
        <input type="checkbox" name="active" defaultChecked={p?.active ?? true} className="accent-navy" /> Live
      </label>
      <div className="flex items-center gap-2">
        <button disabled={pending} className={p ? "btn-navy px-4 py-2 text-sm" : "btn-brand px-4 py-2 text-sm"}>{p ? "Save" : "Add"}</button>
        {p && (
          <button
            type="button"
            disabled={delPending}
            title={`Delete (${p.count} universities linked)`}
            onClick={() => confirm(`Delete "${p.name}"? It will be removed from ${p.count} universities.`) && start(() => deleteProgram(p.id))}
            className="grid size-9 place-items-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>
      <div className="md:col-span-6"><StatusMsg state={state} /></div>
    </form>
  );
}

export function ProgramEditor({ programs }: { programs: P[] }) {
  return (
    <>
      <Card>
        {programs.map((p) => <Row key={`${p.id}-${p.name}-${p.icon}-${p.sortOrder}-${p.active}`} p={p} />)}
      </Card>
      <h2 className="mb-2 mt-6 font-bold">Add new program</h2>
      <Card><Row key={programs.length} /></Card>
    </>
  );
}
