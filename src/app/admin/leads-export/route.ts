import { LeadStatus } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const cell = (v: unknown) => {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // prevent CSV formula injection
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET(req: NextRequest) {
  if (!(await getSession())) return new NextResponse("Unauthorized", { status: 401 });
  const sp = req.nextUrl.searchParams;
  const status = Object.values(LeadStatus).includes(sp.get("status") as LeadStatus) ? (sp.get("status") as LeadStatus) : undefined;
  const q = sp.get("q")?.trim();
  const leads = await prisma.lead.findMany({
    where: {
      ...(status && { status }),
      ...(q && { OR: [{ name: { contains: q, mode: "insensitive" } }, { phone: { contains: q } }, { email: { contains: q, mode: "insensitive" } }] }),
    },
    orderBy: { createdAt: "desc" },
    include: { university: { select: { name: true } } },
  });
  const head = ["Received", "Name", "Phone", "Email", "Qualification", "Course", "Location", "University", "Source", "Status", "Notes"];
  const rows = leads.map((l) =>
    [l.createdAt.toISOString(), l.name, l.phone, l.email, l.qualification, l.course, l.location, l.university?.name, l.source, l.status, l.notes].map(cell).join(","),
  );
  return new NextResponse("﻿" + [head.join(","), ...rows].join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
