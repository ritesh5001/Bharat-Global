import { prisma } from "@/lib/db";
import { getSiteSettings } from "@/lib/data";
import { Card, PageHeader } from "@/components/admin/ui";
import { AddAdminForm, PasswordForm, SettingsForm } from "@/components/admin/settings-forms";

export default async function SettingsPage() {
  const [s, admins] = await Promise.all([getSiteSettings(), prisma.adminUser.findMany({ select: { id: true, name: true, email: true }, orderBy: { createdAt: "asc" } })]);
  return (
    <>
      <PageHeader title="Settings" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card><h2 className="mb-4 font-bold">Website contact details</h2><SettingsForm s={s} /></Card>
        <div className="space-y-6">
          <Card><h2 className="mb-4 font-bold">Change your password</h2><PasswordForm /></Card>
          <Card>
            <h2 className="mb-3 font-bold">Admin users</h2>
            <ul className="mb-4 space-y-1 text-sm">{admins.map((a) => <li key={a.id}>{a.name} <span className="text-slate-500">· {a.email}</span></li>)}</ul>
            <AddAdminForm />
          </Card>
        </div>
      </div>
    </>
  );
}
