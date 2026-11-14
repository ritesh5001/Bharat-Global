import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import { ProgramEditor } from "@/components/admin/program-editor";

export default async function ProgramsPage() {
  const programs = await prisma.program.findMany({ orderBy: { sortOrder: "asc" }, include: { _count: { select: { universities: true } } } });
  return (
    <>
      <PageHeader title="Programs" />
      <p className="-mt-3 mb-5 text-sm text-slate-500">These appear as filter chips on the homepage and in the footer.</p>
      <ProgramEditor programs={programs.map((p) => ({ id: p.id, name: p.name, icon: p.icon, duration: p.duration, sortOrder: p.sortOrder, active: p.active, count: p._count.universities }))} />
    </>
  );
}
