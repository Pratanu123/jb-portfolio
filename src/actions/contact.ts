"use server";

import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Please sign your name."),
  email: z.string().email("A proper address, if you please."),
  message: z.string().min(12, "A little more ink on the page."),
});

export async function sendMessage(_: { error?: string; ok?: boolean } | undefined, formData: FormData) {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the letter." };
  }

  return { ok: true };
}
