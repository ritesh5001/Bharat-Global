import { LoginForm } from "./login-form";

export const metadata = { title: "Admin Login" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <div className="grid min-h-dvh place-items-center bg-navy px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <h1 className="font-display text-2xl font-extrabold text-navy">Admin Panel</h1>
        <p className="mt-1 text-sm text-slate-500">Bharat Global Education</p>
        <LoginForm next={next ?? "/admin"} />
      </div>
    </div>
  );
}
