"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/data";
import { sendLeadConfirmation, sendLeadNotification } from "@/lib/email";
import { leadSchema, type LeadInput } from "@/lib/validation";

export type LeadResult = { ok: true } | { ok: false; error: string; fieldErrors?: Record<string, string> };

// Simple in-memory rate limit (fine for a single-instance monolith).
const hits = new Map<string, number[]>();
function rateLimited(key: string, limit = 5, windowMs = 10 * 60_000) {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(key, arr);
  return arr.length > limit;
}

export async function submitLead(input: LeadInput): Promise<LeadResult> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0] ?? "form");
      fieldErrors[k] ??= issue.message;
    }
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors };
  }
  const { company: _hp, universityId, ...data } = parsed.data;

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  if (rateLimited(ip)) return { ok: false, error: "Too many requests. Please try again in a few minutes." };

  const university = universityId
    ? await prisma.university.findUnique({ where: { id: universityId }, select: { id: true, name: true } })
    : null;

  await prisma.lead.create({ data: { ...data, universityId: university?.id } });

  const settings = await getSiteSettings();
  const emailData = { ...data, universityName: university?.name };
  // Email failures must never block lead capture.
  await Promise.allSettled([
    sendLeadNotification(settings.leadNotifyTo, emailData),
    sendLeadConfirmation(emailData, settings.phone),
  ]);

  return { ok: true };
}
