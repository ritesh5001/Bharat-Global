export function PageHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="font-display text-2xl font-extrabold text-navy">{title}</h1>
      {children}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}

export function StatusMsg({ state }: { state: { error?: string; ok?: string } | null }) {
  if (!state) return null;
  if (state.error) return <p className="text-sm font-medium text-red-600">{state.error}</p>;
  if (state.ok) return <p className="text-sm font-medium text-green-700">{state.ok}</p>;
  return null;
}

export const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-blue-50 text-blue-700",
  CONTACTED: "bg-amber-50 text-amber-700",
  INTERESTED: "bg-purple-50 text-purple-700",
  ENROLLED: "bg-green-50 text-green-700",
  CLOSED: "bg-slate-100 text-slate-600",
};
