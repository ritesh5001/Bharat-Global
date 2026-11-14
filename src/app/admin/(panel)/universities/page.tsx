import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { inr } from "@/lib/format";
import { Card, PageHeader } from "@/components/admin/ui";
import { RowActions } from "@/components/admin/row-actions";

export default async function UniversitiesPage({ searchParams }: { searchParams: Promise<{ q?: string; saved?: string }> }) {
  const { q = "", saved } = await searchParams;
  const unis = await prisma.university.findMany({
    where: q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { city: { contains: q, mode: "insensitive" } }] } : undefined,
    orderBy: [{ popularity: "desc" }, { name: "asc" }],
    include: { _count: { select: { leads: true, programs: true } } },
  });

  return (
    <>
      <PageHeader title="Universities">
        <Link href="/admin/universities/new" className="btn-brand text-sm">
          <Plus className="size-4" /> Add university
        </Link>
      </PageHeader>
      {saved && <p className="mb-4 rounded-xl bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700">University saved. Changes are live on the website.</p>}
      <form className="mb-4">
        <input name="q" defaultValue={q} placeholder="Search by name or city…" className="field max-w-sm" />
      </form>
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">University</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Total fee</th>
              <th className="px-4 py-3">Programs</th>
              <th className="px-4 py-3">Leads</th>
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {unis.map((u) => (
              <tr key={u.id} className={u.active ? "" : "opacity-60"}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg text-[10px] font-extrabold text-white" style={{ backgroundColor: u.logoColor }}>
                      {u.initials}
                    </span>
                    <Link href={`/admin/universities/${u.id}`} className="font-semibold text-navy hover:underline">{u.name}</Link>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{u.city}, {u.state}</td>
                <td className="px-4 py-3 font-semibold">{inr(u.totalFee)}</td>
                <td className="px-4 py-3">{u._count.programs}</td>
                <td className="px-4 py-3">{u._count.leads}</td>
                <td className="px-4 py-3">{u.popularity}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${u.active ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                    {u.active ? "Live" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <RowActions id={u.id} active={u.active} editHref={`/admin/universities/${u.id}`} name={u.name} />
                </td>
              </tr>
            ))}
            {unis.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-500">No universities found.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </>
  );
}
