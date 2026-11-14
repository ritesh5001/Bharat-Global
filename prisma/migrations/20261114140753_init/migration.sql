-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'INTERESTED', 'ENROLLED', 'CLOSED');

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'GraduationCap',
    "duration" TEXT NOT NULL DEFAULT '2 Years',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "University" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "initials" TEXT NOT NULL,
    "logoColor" TEXT NOT NULL DEFAULT '#0b2a5b',
    "logoUrl" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "ugcDeb" BOOLEAN NOT NULL DEFAULT true,
    "naacGrade" TEXT,
    "nirfRank" TEXT,
    "wesAccredited" BOOLEAN NOT NULL DEFAULT false,
    "featuredProgram" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "courseTags" TEXT[],
    "totalFee" INTEGER NOT NULL,
    "semesterFee" INTEGER NOT NULL,
    "emiPerMonth" INTEGER NOT NULL,
    "examMode" TEXT NOT NULL DEFAULT 'Online Proctored (From Home)',
    "specializations" TEXT NOT NULL,
    "hiringPartners" TEXT NOT NULL,
    "highlights" TEXT[],
    "brochureUrl" TEXT,
    "applyUrl" TEXT,
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "University_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UniversityProgram" (
    "universityId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,

    CONSTRAINT "UniversityProgram_pkey" PRIMARY KEY ("universityId","programId")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "qualification" TEXT,
    "course" TEXT,
    "location" TEXT,
    "source" TEXT NOT NULL,
    "notes" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "universityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" TEXT NOT NULL DEFAULT 'site',
    "phone" TEXT NOT NULL DEFAULT '+91 98765-43210',
    "whatsapp" TEXT NOT NULL DEFAULT '919876543210',
    "email" TEXT NOT NULL DEFAULT 'admissions@bharatglobaleducation.in',
    "address" TEXT NOT NULL DEFAULT 'Sector 62, Noida / Delhi NCR, India',
    "helplineHours" TEXT NOT NULL DEFAULT 'Mon–Sun, 9 AM – 8 PM',
    "leadNotifyTo" TEXT NOT NULL DEFAULT 'admissions@bharatglobaleducation.in',

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Program_name_key" ON "Program"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Program_slug_key" ON "Program"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "University_slug_key" ON "University"("slug");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- AddForeignKey
ALTER TABLE "UniversityProgram" ADD CONSTRAINT "UniversityProgram_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityProgram" ADD CONSTRAINT "UniversityProgram_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE SET NULL ON UPDATE CASCADE;
