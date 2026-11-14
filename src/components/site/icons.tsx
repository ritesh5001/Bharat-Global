import {
  BarChart3, BookOpen, Briefcase, Calculator, Code2, GraduationCap, Landmark, LayoutGrid, Monitor, type LucideIcon,
} from "lucide-react";

export const PROGRAM_ICONS: Record<string, LucideIcon> = {
  Briefcase, Monitor, BarChart3, Code2, Calculator, Landmark, BookOpen, GraduationCap, LayoutGrid,
};

export const PROGRAM_ICON_NAMES = Object.keys(PROGRAM_ICONS);

export function ProgramIcon({ name, className }: { name: string; className?: string }) {
  const Icon = PROGRAM_ICONS[name] ?? GraduationCap;
  return <Icon className={className} />;
}
