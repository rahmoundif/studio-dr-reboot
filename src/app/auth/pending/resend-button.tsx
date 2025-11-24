"use client";

import { useState } from "react";

export default function ResendButton({
  id,
  email,
}: {
  id: string;
  email: string;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleResend = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, email }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Erreur lors de l'envoi");
      setMessage("Email de validation renvoyé");
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        className="w-full border rounded-md px-3 py-2"
        onClick={handleResend}
        disabled={loading}
      >
        {loading ? "Envoi…" : "Renvoyer l'email de validation"}
      </button>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}
