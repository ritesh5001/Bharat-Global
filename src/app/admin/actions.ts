"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { LeadStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/format";
import { universitySchema } from "@/lib/validation";

export type FormState = { error?: string; ok?: string } | null;

const refreshSite = () => revalidatePath("/");

function uniqueViolation(e: unknown) {
  return e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";
}

/* ---------------- Universities ---------------- */

function readUniversity(fd: FormData) {
  const s = (k: string) => String(fd.get(k) ?? "");
  return universitySchema.safeParse({
    name: s("name"),
    shortName: s("shortName"),
    slug: s("slug"),
    initials: s("initials"),
    logoColor: s("logoColor"),
    logoUrl: s("logoUrl"),
    city: s("city"),
    state: s("state"),
    ugcDeb: fd.get("ugcDeb") === "on",
    naacGrade: s("naacGrade"),
    nirfRank: s("nirfRank"),
    wesAccredited: fd.get("wesAccredited") === "on",
    featuredProgram: s("featuredProgram"),
    duration: s("duration"),
    courseTags: s("courseTags"),
    totalFee: s("totalFee"),
    semesterFee: s("semesterFee"),
    emiPerMonth: s("emiPerMonth"),
    examMode: s("examMode"),
    specializations: s("specializations"),
    hiringPartners: s("hiringPartners"),
    highlights: s("highlights"),
    brochureUrl: s("brochureUrl"),
    applyUrl: s("applyUrl"),
    popularity: s("popularity") || "0",
    active: fd.get("active") === "on",
    programIds: fd.getAll("programIds").map(String),
  });
}

export async function saveUniversity(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = String(fd.get("id") ?? "") || null;
  const parsed = readUniversity(fd);
  if (!parsed.success) {
    const i = parsed.error.issues[0];
    return { error: `${String(i.path[0])}: ${i.message}` };
  }
  const { programIds, slug, ...data } = parsed.data;
  const finalSlug = slugify(slug || data.name);
  const programs = { create: programIds.map((programId) => ({ programId })) };

  try {
    if (id) {
      await prisma.$transaction([
        prisma.universityProgram.deleteMany({ where: { universityId: id } }),
        prisma.university.update({ where: { id }, data: { ...data, slug: finalSlug, programs } }),
      ]);
    } else {
      await prisma.university.create({ data: { ...data, slug: finalSlug, programs } });
    }
  } catch (e) {
    if (uniqueViolation(e)) return { error: "Another university already uses this slug." };
    throw e;
  }
  refreshSite();
  revalidatePath("/admin/universities");
  redirect("/admin/universities?saved=1");
}

export async function toggleUniversity(id: string) {
  await requireAdmin();
  const u = await prisma.university.findUniqueOrThrow({ where: { id }, select: { active: true } });
  await prisma.university.update({ where: { id }, data: { active: !u.active } });
  refreshSite();
  revalidatePath("/admin/universities");
}

export async function deleteUniversity(id: string) {
  await requireAdmin();
  await prisma.university.delete({ where: { id } });
  refreshSite();
  revalidatePath("/admin/universities");
}

/* ---------------- Programs ---------------- */

const programSchema = z.object({
  name: z.string().trim().min(2),
  icon: z.string().trim().min(1),
  duration: z.string().trim().min(1),
  sortOrder: z.coerce.number().int(),
  active: z.boolean(),
});

export async function saveProgram(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = String(fd.get("id") ?? "") || null;
  const parsed = programSchema.safeParse({
    name: fd.get("name"),
    icon: fd.get("icon"),
    duration: fd.get("duration"),
    sortOrder: fd.get("sortOrder") || 0,
    active: fd.get("active") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const data = { ...parsed.data, slug: slugify(parsed.data.name) };
  try {
    if (id) await prisma.program.update({ where: { id }, data });
    else await prisma.program.create({ data });
  } catch (e) {
    if (uniqueViolation(e)) return { error: "A program with this name already exists." };
    throw e;
  }
  refreshSite();
  revalidatePath("/admin/programs");
  return { ok: id ? "Program updated." : "Program added." };
}

export async function deleteProgram(id: string) {
  await requireAdmin();
  await prisma.program.delete({ where: { id } });
  refreshSite();
  revalidatePath("/admin/programs");
}

/* ---------------- Leads ---------------- */

export async function updateLead(id: string, status: LeadStatus, notes: string) {
  await requireAdmin();
  await prisma.lead.update({ where: { id }, data: { status, notes: notes.slice(0, 2000) || null } });
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function deleteLead(id: string) {
  await requireAdmin();
  await prisma.lead.delete({ where: { id } });
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

/* ---------------- Settings ---------------- */

const settingsSchema = z.object({
  phone: z.string().trim().min(5),
  whatsapp: z.string().trim().regex(/^\d{10,15}$/, "WhatsApp must be digits with country code, e.g. 919876543210"),
  email: z.email(),
  address: z.string().trim().min(3),
  helplineHours: z.string().trim().min(3),
  leadNotifyTo: z.email("Lead notification email is invalid"),
});

export async function saveSettings(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  await prisma.siteSetting.upsert({ where: { id: "site" }, update: parsed.data, create: { id: "site", ...parsed.data } });
  refreshSite();
  return { ok: "Settings saved." };
}

export async function changePassword(_: FormState, fd: FormData): Promise<FormState> {
  const session = await requireAdmin();
  const current = String(fd.get("current") ?? "");
  const next = String(fd.get("next") ?? "");
  if (next.length < 8) return { error: "New password must be at least 8 characters." };
  const user = await prisma.adminUser.findUnique({ where: { id: session.sub } });
  if (!user || !(await bcrypt.compare(current, user.passwordHash))) return { error: "Current password is incorrect." };
  await prisma.adminUser.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(next, 10) } });
  return { ok: "Password updated." };
}

const newAdminSchema = z.object({ name: z.string().trim().min(2), email: z.email(), password: z.string().min(8) });

export async function addAdmin(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = newAdminSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    await prisma.adminUser.create({
      data: { name: parsed.data.name, email: parsed.data.email.toLowerCase(), passwordHash: await bcrypt.hash(parsed.data.password, 10) },
    });
  } catch (e) {
    if (uniqueViolation(e)) return { error: "An admin with this email already exists." };
    throw e;
  }
  revalidatePath("/admin/settings");
  return { ok: "Admin user added." };
}
