import "server-only";
import { prisma } from "./db";
import type { ProgramDTO, SiteSettingsDTO, UniversityDTO } from "./types";

export async function getPublicUniversities(): Promise<UniversityDTO[]> {
  const rows = await prisma.university.findMany({
    where: { active: true },
    orderBy: [{ popularity: "desc" }, { name: "asc" }],
    include: { programs: { include: { program: true } } },
  });
  return rows.map(({ programs, createdAt: _c, updatedAt: _u, active: _a, ...u }) => ({
    ...u,
    programSlugs: programs.map((p) => p.program.slug),
    programNames: programs
      .sort((a, b) => a.program.sortOrder - b.program.sortOrder)
      .map((p) => p.program.name),
  }));
}

export async function getPublicPrograms(): Promise<ProgramDTO[]> {
  return prisma.program.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true, slug: true, icon: true, duration: true },
  });
}

export async function getSiteSettings(): Promise<SiteSettingsDTO & { leadNotifyTo: string }> {
  return prisma.siteSetting.upsert({ where: { id: "site" }, update: {}, create: { id: "site" } });
}
