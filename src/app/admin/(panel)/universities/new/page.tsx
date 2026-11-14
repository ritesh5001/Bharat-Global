import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import { UniversityForm } from "@/components/admin/university-form";

export default async function NewUniversity() {
  const programs = await prisma.program.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } });
  return (
    <>
      <PageHeader title="Add university" />
      <UniversityForm programs={programs} />
    </>
  );
}
