import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, PageHeader, STATUS_STYLES } from "@/components/admin/ui";

export default async function Dashboard() {
  const since = new Date(Date.now() - 7 * 864e5);
  const [unis, activeUnis, programs, leads, newLeads, weekLeads, recent, bySource] = await Promise.all([
    prisma.university.count(),
    prisma.university.count({ where: { active: true } }),
    prisma.program.count(),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.lead.count({ where: { createdAt: { gte: since } } }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { university: { select: { shortName: true } } } }),
    prisma.lead.groupBy({ by: ["source"], _count: true }),
  ]);

  const stats = [
    { label: "Universities", value: `${activeUnis} / ${unis}`, hint: "active / total", href: "/admin/universities" },
    { label: "Programs", value: programs, href: "/admin/programs" },
    { label: "Total leads", value: leads, href: "/admin/leads" },
    { label: "New leads", value: newLeads, hint: `${weekLeads} in last 7 days`, href: "/admin/leads?status=NEW" },
  ];

  return (
    <>
      <PageHeader title="Dashboard" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="transition hover:border-navy/30">
              <p className="text-sm text-slate-500">{s.label}</p>
              <p className="mt-1 font-display text-3xl font-extrabold text-navy">{s.value}</p>
              {s.hint && <p className="mt-1 text-xs text-slate-400">{s.hint}</p>}
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Recent leads</h2>
            <Link href="/admin/leads" className="text-sm font-semibold text-brand">View all →</Link>
          </div>
          {recent.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">No leads yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recent.map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{l.name} <span className="font-normal text-slate-500">· {l.phone}</span></p>
                    <p className="truncate text-xs text-slate-500">
                      {l.source}{l.university ? ` · ${l.university.shortName}` : ""} · {l.createdAt.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-bold ${STATUS_STYLES[l.status]}`}>{l.status}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <h2 className="mb-3 font-bold text-slate-900">Leads by source</h2>
          <ul className="space-y-2 text-sm">
            {bySource.length === 0 && <li className="text-slate-500">—</li>}
            {bySource.sort((a, b) => b._count - a._count).map((s) => (
              <li key={s.source} className="flex justify-between">
                <span className="capitalize text-slate-600">{s.source.replace("-", " ")}</span>
                <span className="font-bold">{s._count}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
