"use client";

import { useTransition } from "react";

export function ConfirmDelete({
  label,
  message,
  action,
}: {
  label: string;
  message: string;
  action: () => Promise<{ error?: string } | void>;
}) {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      className="label text-crimson hover:underline"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(message)) return;
        start(async () => {
          const result = await action();
          if (result?.error) window.alert(result.error);
        });
      }}
    >
      {pending ? "Removing…" : label}
    </button>
  );
}
