export type UniversityDTO = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  initials: string;
  logoColor: string;
  logoUrl: string | null;
  city: string;
  state: string;
  ugcDeb: boolean;
  naacGrade: string | null;
  nirfRank: string | null;
  wesAccredited: boolean;
  featuredProgram: string;
  duration: string;
  courseTags: string[];
  totalFee: number;
  semesterFee: number;
  emiPerMonth: number;
  examMode: string;
  specializations: string;
  hiringPartners: string;
  highlights: string[];
  brochureUrl: string | null;
  applyUrl: string | null;
  popularity: number;
  programSlugs: string[];
  programNames: string[];
};

export type ProgramDTO = { id: string; name: string; slug: string; icon: string; duration: string };

export type SiteSettingsDTO = {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  helplineHours: string;
};
