"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth";

export default function LoginPage() {
  const [error, action, pending] = useActionState(loginAction, undefined);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
      <h1 className="font-display text-4xl">Admin</h1>
      <form action={action} className="paper-wash mt-8 space-y-4 p-6">
        {error ? <p className="text-crimson">{error}</p> : null}
        <label className="block">
          <span className="label text-violet">Email</span>
          <input name="email" type="email" required className="field mt-2" />
        </label>
        <label className="block">
          <span className="label text-violet">Password</span>
          <input name="password" type="password" required className="field mt-2" />
        </label>
        <button className="btn-gold w-full" type="submit" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
