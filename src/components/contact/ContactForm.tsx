"use client";

import { useActionState } from "react";
import { sendMessage } from "@/actions/contact";

type Props = {
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  submitLabel: string;
  submittingLabel: string;
  successMessage: string;
};

export function ContactForm({
  nameLabel,
  emailLabel,
  messageLabel,
  submitLabel,
  submittingLabel,
  successMessage,
}: Props) {
  const [state, action, pending] = useActionState(sendMessage, undefined);

  if (state?.ok) {
    return (
      <p className="folio-body border border-gold/50 bg-plum/40 px-6 py-8 text-center">
        {successMessage}
      </p>
    );
  }

  return (
    <form action={action} className="space-y-5">
      {state?.error ? <p className="text-crimson-bright">{state.error}</p> : null}
      <label className="block">
        <span className="label text-gold">{nameLabel}</span>
        <input name="name" required className="field mt-2" />
      </label>
      <label className="block">
        <span className="label text-gold">{emailLabel}</span>
        <input name="email" type="email" required className="field mt-2" />
      </label>
      <label className="block">
        <span className="label text-gold">{messageLabel}</span>
        <textarea name="message" rows={6} required className="field mt-2" />
      </label>
      <button className="btn-gold" type="submit" disabled={pending}>
        {pending ? submittingLabel : submitLabel}
      </button>
    </form>
  );
}
