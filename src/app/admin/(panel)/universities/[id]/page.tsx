import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import { UniversityForm } from "@/components/admin/university-form";

export default async function EditUniversity({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [u, programs] = await Promise.all([
    prisma.university.findUnique({ where: { id }, include: { programs: true } }),
    prisma.program.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!u) notFound();
  const { programs: links, createdAt: _c, updatedAt: _u, ...rest } = u;
  return (
    <>
      <PageHeader title={`Edit: ${u.name}`} />
      <UniversityForm programs={programs} initial={{ ...rest, programIds: links.map((l) => l.programId) }} />
    </>
  );
}
