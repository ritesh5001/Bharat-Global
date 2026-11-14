import Link from "next/link";
import { Download } from "lucide-react";
import { LeadStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { Card, PageHeader } from "@/components/admin/ui";
import { LeadRow } from "@/components/admin/lead-row";

const PAGE = 25;

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string; page?: string }> }) {
  const sp = await searchParams;
  const status = Object.values(LeadStatus).includes(sp.status as LeadStatus) ? (sp.status as LeadStatus) : undefined;
  const q = sp.q?.trim() ?? "";
  const page = Math.max(1, Number(sp.page) || 1);
  const where: Prisma.LeadWhereInput = {
    ...(status && { status }),
    ...(q && { OR: [{ name: { contains: q, mode: "insensitive" } }, { phone: { contains: q } }, { email: { contains: q, mode: "insensitive" } }] }),
  };
  const [leads, total] = await Promise.all([
    prisma.lead.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE, take: PAGE, include: { university: { select: { name: true } } } }),
    prisma.lead.count({ where }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE));
  const qs = (o: Record<string, string | number | undefined>) =>
    "?" + new URLSearchParams(Object.entries({ status, q: q || undefined, ...o }).filter(([, v]) => v !== undefined && v !== "") as [string, string][]).toString();

  return (
    <>
      <PageHeader title={`Leads (${total})`}>
        <a href={`/admin/leads-export${qs({})}`} className="btn-navy text-sm"><Download className="size-4" /> Export CSV</a>
      </PageHeader>

      <form className="mb-4 flex flex-wrap gap-2">
        <input name="q" defaultValue={q} placeholder="Search name, phone, email…" className="field max-w-xs py-2" />
        <select name="status" defaultValue={status ?? ""} className="field w-44 py-2">
          <option value="">All statuses</option>
          {Object.values(LeadStatus).map((s) => <option key={s}>{s}</option>)}
        </select>
        <button className="btn-navy px-4 py-2 text-sm">Filter</button>
      </form>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Details</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Received</th>
              <th className="px-4 py-3">Status &amp; notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((l) => (
              <LeadRow key={l.id} lead={{ ...l, universityName: l.university?.name ?? null, createdAt: l.createdAt.toLocaleString("en-IN") }} />
            ))}
            {leads.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-500">No leads found.</td></tr>}
          </tbody>
        </table>
      </Card>

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3 text-sm">
          {page > 1 && <Link href={qs({ page: page - 1 })} className="font-semibold text-navy">← Prev</Link>}
          <span className="text-slate-500">Page {page} of {pages}</span>
          {page < pages && <Link href={qs({ page: page + 1 })} className="font-semibold text-navy">Next →</Link>}
        </div>
      )}
    </>
  );
}
