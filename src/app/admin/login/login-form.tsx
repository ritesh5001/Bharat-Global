"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { loginAction } from "../auth-actions";

export function LoginForm({ next }: { next: string }) {
  const [error, action, pending] = useActionState(loginAction, null);
  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="username" className="field" />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="field" />
      </div>
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      <button disabled={pending} className="btn-navy w-full">
        {pending && <Loader2 className="size-4 animate-spin" />} Sign in
      </button>
    </form>
  );
}
