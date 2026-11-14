import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const programs = [
  { name: "Online MBA", slug: "online-mba", icon: "Briefcase", duration: "2 Years" },
  { name: "Online MCA", slug: "online-mca", icon: "Monitor", duration: "2 Years" },
  { name: "Online BBA", slug: "online-bba", icon: "BarChart3", duration: "3 Years" },
  { name: "Online BCA", slug: "online-bca", icon: "Code2", duration: "3 Years" },
  { name: "Online B.Com", slug: "online-bcom", icon: "Calculator", duration: "3 Years" },
  { name: "Online M.Com", slug: "online-mcom", icon: "Landmark", duration: "2 Years" },
  { name: "BA / MA Journalism", slug: "ba-ma-journalism", icon: "BookOpen", duration: "3 Years / 2 Years" },
];

type Seed = {
  slug: string; name: string; shortName: string; initials: string; logoColor: string;
  city: string; state: string; naacGrade: string; nirfRank: string; wesAccredited?: boolean;
  featuredProgram: string; duration: string; courseTags: string[];
  totalFee: number; semesterFee: number; emiPerMonth: number;
  specializations: string; hiringPartners: string; highlights: string[];
  popularity: number; programs: string[];
};

const universities: Seed[] = [
  {
    slug: "amity-university-online", name: "Amity University Online", shortName: "Amity (AU)", initials: "AU", logoColor: "#1e3a8a",
    city: "Noida", state: "Uttar Pradesh", naacGrade: "A+", nirfRank: "#32", wesAccredited: true,
    featuredProgram: "Online MBA (20+ Specializations)", duration: "2 Years (4 Semesters)", courseTags: ["MBA", "MCA", "BBA", "BCA"],
    totalFee: 199000, semesterFee: 49750, emiPerMonth: 8292,
    specializations: "Finance, Marketing, HR, Data Analytics, International Business, Digital Marketing",
    hiringPartners: "TCS, Accenture, Amazon, Deloitte, HDFC Bank",
    highlights: ["QS Ranked Online MBA", "Physical Books Delivered", "300+ Hiring Partners"],
    popularity: 100, programs: ["online-mba", "online-mca", "online-bba", "online-bca", "online-bcom", "ba-ma-journalism"],
  },
  {
    slug: "manipal-university-jaipur", name: "Manipal University Jaipur (MUJ)", shortName: "Manipal (MUJ)", initials: "MUJ", logoColor: "#ea580c",
    city: "Jaipur", state: "Rajasthan", naacGrade: "A+", nirfRank: "Ranked",
    featuredProgram: "Online MBA & MCA Dual Specialization", duration: "2 Years (4 Semesters)", courseTags: ["MBA", "MCA", "BBA", "BCA"],
    totalFee: 175000, semesterFee: 43750, emiPerMonth: 7292,
    specializations: "BFSI, IT & FinTech, Analytics & Data Science, Retail Management",
    hiringPartners: "Infosys, Capgemini, Wipro, Genpact",
    highlights: ["Coursera Access Included", "Dual Specialization", "Virtual Labs"],
    popularity: 95, programs: ["online-mba", "online-mca", "online-bba", "online-bca", "online-bcom", "online-mcom"],
  },
  {
    slug: "nmims-cdoe", name: "NMIMS CDOE (Narsee Monjee)", shortName: "NMIMS", initials: "NMIMS", logoColor: "#b91c1c",
    city: "Mumbai", state: "Maharashtra", naacGrade: "A++", nirfRank: "Top 50",
    featuredProgram: "Online MBA (Working Professionals)", duration: "2 Years (4 Semesters)", courseTags: ["MBA", "BBA", "B.Com"],
    totalFee: 210000, semesterFee: 52500, emiPerMonth: 8750,
    specializations: "Finance, Marketing, HR, Operations & Supply Chain, Business Management",
    hiringPartners: "Deloitte, KPMG, ICICI Bank, Axis Bank",
    highlights: ["Legacy B-School Brand", "Industry Webinars", "Mumbai Campus Alumni Network"],
    popularity: 90, programs: ["online-mba", "online-bba", "online-bcom"],
  },
  {
    slug: "jain-university-online", name: "Jain (Deemed-to-be) University Online", shortName: "Jain (JU)", initials: "JU", logoColor: "#312e81",
    city: "Bengaluru", state: "Karnataka", naacGrade: "A++", nirfRank: "#65",
    featuredProgram: "Online MCA & MBA (Electives)", duration: "2 Years (4 Semesters)", courseTags: ["MCA", "MBA", "BBA", "BCA"],
    totalFee: 130000, semesterFee: 32500, emiPerMonth: 5417,
    specializations: "AI & ML, Cloud Computing, Cyber Security, Finance, Marketing",
    hiringPartners: "Infosys, Wipro, HCL, Tech Mahindra",
    highlights: ["Tech-first Electives", "Live Online Classes", "Placement Assistance"],
    popularity: 85, programs: ["online-mca", "online-mba", "online-bba", "online-bca", "online-bcom", "online-mcom"],
  },
  {
    slug: "dy-patil-vidyapeeth-online", name: "Dr. D. Y. Patil Vidyapeeth Online (DPU)", shortName: "DY Patil (DPU)", initials: "DPU", logoColor: "#9f1239",
    city: "Pune", state: "Maharashtra", naacGrade: "A++", nirfRank: "#44",
    featuredProgram: "Online BBA & MBA Healthcare/Mgmt", duration: "3 Years (6 Semesters)", courseTags: ["BBA", "MBA"],
    totalFee: 105000, semesterFee: 17500, emiPerMonth: 4375,
    specializations: "Hospital & Healthcare Management, Pharma Management, Finance, HR",
    hiringPartners: "Apollo Hospitals, Fortis, Cipla, Sun Pharma",
    highlights: ["Healthcare Specializations", "Affordable Fees", "Industry Mentorship"],
    popularity: 80, programs: ["online-bba", "online-mba"],
  },
  {
    slug: "chandigarh-university-online", name: "Chandigarh University Online (CU)", shortName: "Chandigarh (CU)", initials: "CU", logoColor: "#dc2626",
    city: "Mohali", state: "Punjab", naacGrade: "A+", nirfRank: "#20",
    featuredProgram: "Online B.Com / BBA / MBA / MCA", duration: "3 Years (6 Semesters)", courseTags: ["B.Com", "BBA", "MBA", "MCA"],
    totalFee: 89000, semesterFee: 14833, emiPerMonth: 3708,
    specializations: "Accounting & Finance, Marketing, International Business, Data Science",
    hiringPartners: "Amazon, Flipkart, Byju's, Paytm",
    highlights: ["QS World Ranked", "Low-cost EMI", "Global Alumni Network"],
    popularity: 78, programs: ["online-bcom", "online-bba", "online-mba", "online-mca", "online-bca"],
  },
  {
    slug: "symbiosis-ssodl", name: "Symbiosis School for Online & Digital Learning", shortName: "Symbiosis (SSODL)", initials: "SSODL", logoColor: "#7f1d1d",
    city: "Pune", state: "Maharashtra", naacGrade: "A++", nirfRank: "#31",
    featuredProgram: "Online BA / MA Mass Comm & Economics", duration: "3 Years / 2 Years", courseTags: ["BA / MA Journalism", "MBA", "BBA", "BCA"],
    totalFee: 90000, semesterFee: 15000, emiPerMonth: 3750,
    specializations: "Journalism, Mass Communication, Economics, Digital Media",
    hiringPartners: "Times Group, NDTV, Ogilvy, Dentsu",
    highlights: ["Premium Symbiosis Brand", "Media Industry Projects", "Live Masterclasses"],
    popularity: 75, programs: ["ba-ma-journalism", "online-mba", "online-bba", "online-bca"],
  },
  {
    slug: "shoolini-university-online", name: "Shoolini University Online", shortName: "Shoolini (SU)", initials: "SU", logoColor: "#047857",
    city: "Solan", state: "Himachal Pradesh", naacGrade: "A+", nirfRank: "#70",
    featuredProgram: "Online M.Com / MBA (Pay After Placement)", duration: "2 Years (4 Semesters)", courseTags: ["M.Com", "MBA", "BBA", "BCA"],
    totalFee: 78000, semesterFee: 19500, emiPerMonth: 3250,
    specializations: "Finance, Marketing, Taxation, Banking & Insurance",
    hiringPartners: "Bajaj Finserv, HDFC Life, Kotak, Max Life",
    highlights: ["Pay After Placement Option", "Lowest Fee Bracket", "THE Ranked"],
    popularity: 70, programs: ["online-mcom", "online-mba", "online-bba", "online-bca"],
  },
  {
    slug: "srm-institute-online", name: "SRM Institute of Science & Technology", shortName: "SRM", initials: "SRM", logoColor: "#0c4a6e",
    city: "Chennai", state: "Tamil Nadu", naacGrade: "A++", nirfRank: "#12",
    featuredProgram: "Online MCA & MBA Tech Management", duration: "2 Years (4 Semesters)", courseTags: ["MCA", "MBA", "BBA", "B.Com"],
    totalFee: 150000, semesterFee: 37500, emiPerMonth: 6250,
    specializations: "Data Science, Cyber Security, Technology Management, Marketing",
    hiringPartners: "Zoho, Cognizant, TCS, Freshworks",
    highlights: ["NIRF Top 15", "Strong Tech Curriculum", "Campus Immersion"],
    popularity: 72, programs: ["online-mca", "online-mba", "online-bba", "online-bcom"],
  },
  {
    slug: "lpu-online", name: "Lovely Professional University (LPU) Online", shortName: "LPU", initials: "LPU", logoColor: "#c2410c",
    city: "Phagwara", state: "Punjab", naacGrade: "A++", nirfRank: "#38",
    featuredProgram: "Online MBA / MCA / BCA", duration: "2 Years (4 Semesters)", courseTags: ["MBA", "MCA", "BCA", "M.Com"],
    totalFee: 110400, semesterFee: 27600, emiPerMonth: 4600,
    specializations: "Finance, Marketing, HR, Logistics, Data Science",
    hiringPartners: "Capgemini, Cognizant, Amazon, Bosch",
    highlights: ["Scholarships Available", "Large Alumni Base", "Placement Support"],
    popularity: 74, programs: ["online-mba", "online-mca", "online-bca", "online-mcom", "online-bba", "ba-ma-journalism"],
  },
];

async function main() {
  for (const [i, p] of programs.entries()) {
    await prisma.program.upsert({ where: { slug: p.slug }, update: {}, create: { ...p, sortOrder: i } });
  }
  const programRows = await prisma.program.findMany();
  const bySlug = Object.fromEntries(programRows.map((p) => [p.slug, p.id]));

  for (const u of universities) {
    const { programs: progSlugs, ...data } = u;
    const exists = await prisma.university.findUnique({ where: { slug: u.slug } });
    if (exists) continue;
    await prisma.university.create({
      data: {
        ...data,
        wesAccredited: data.wesAccredited ?? false,
        programs: { create: progSlugs.map((s) => ({ programId: bySlug[s] })) },
      },
    });
  }

  await prisma.siteSetting.upsert({ where: { id: "site" }, update: {}, create: { id: "site" } });

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    await prisma.adminUser.upsert({
      where: { email },
      update: {},
      create: { email, name: "Admin", passwordHash: await bcrypt.hash(password, 10) },
    });
    console.log(`Admin user ready: ${email}`);
  }
  console.log("Seed complete.");
}

main().finally(() => prisma.$disconnect());
