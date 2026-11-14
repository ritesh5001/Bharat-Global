import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, ""))
    .pipe(z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")),
  email: z
    .string()
    .trim()
    .max(150)
    .optional()
    .transform((v) => (v ? v : undefined))
    .pipe(z.email("Enter a valid email").optional()),
  qualification: z.string().trim().max(100).optional(),
  course: z.string().trim().max(100).optional(),
  location: z.string().trim().max(100).optional(),
  source: z.enum(["counseling", "brochure", "apply", "expert-form", "quiz"]),
  universityId: z.string().max(50).optional(),
  // honeypot — must stay empty
  company: z.string().max(0).optional(),
});

export type LeadInput = z.input<typeof leadSchema>;

const csvList = z.string().transform((s) => s.split(/[,\n]/).map((x) => x.trim()).filter(Boolean));
const optUrl = z
  .string()
  .trim()
  .transform((v) => v || null)
  .pipe(z.url().nullable());

export const universitySchema = z.object({
  name: z.string().trim().min(2),
  shortName: z.string().trim().min(1),
  slug: z.string().trim().optional(),
  initials: z.string().trim().min(1).max(6),
  logoColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  logoUrl: optUrl,
  city: z.string().trim().min(1),
  state: z.string().trim().min(1),
  ugcDeb: z.boolean(),
  naacGrade: z.string().trim().transform((v) => v || null),
  nirfRank: z.string().trim().transform((v) => v || null),
  wesAccredited: z.boolean(),
  featuredProgram: z.string().trim().min(1),
  duration: z.string().trim().min(1),
  courseTags: csvList,
  totalFee: z.coerce.number().int().nonnegative(),
  semesterFee: z.coerce.number().int().nonnegative(),
  emiPerMonth: z.coerce.number().int().nonnegative(),
  examMode: z.string().trim().min(1),
  specializations: z.string().trim(),
  hiringPartners: z.string().trim(),
  highlights: csvList,
  brochureUrl: optUrl,
  applyUrl: optUrl,
  popularity: z.coerce.number().int(),
  active: z.boolean(),
  programIds: z.array(z.string()),
});
