import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "../auth-actions";
import { AdminNav } from "@/components/admin/nav";

export const metadata = { title: "Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return (
    <div className="min-h-dvh bg-slate-100 md:flex">
      <aside className="bg-navy text-white md:sticky md:top-0 md:h-dvh md:w-60 md:shrink-0">
        <div className="flex items-center justify-between px-5 py-4 md:block">
          <Link href="/admin" className="font-display text-lg font-extrabold">
            BGE <span className="text-brand">Admin</span>
          </Link>
          <p className="hidden truncate text-xs text-white/50 md:mt-1 md:block">{session.email}</p>
        </div>
        <AdminNav />
        <div className="hidden px-3 pb-4 md:absolute md:bottom-0 md:block md:w-60">
          <Link href="/" target="_blank" className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10">View website ↗</Link>
          <form action={logoutAction}>
            <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/70 hover:bg-white/10">Log out</button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
