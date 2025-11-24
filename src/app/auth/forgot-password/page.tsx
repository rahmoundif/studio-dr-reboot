"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { createClient } from "@/lib/client";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ForgotPasswordPage({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      const supabase = createClient();

      // Ask Supabase to send a password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        throw error;
      }

      setMessage(
        "Si un compte existe avec cet e-mail, un lien de réinitialisation a été envoyé.",
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={cn("max-w-md mx-auto p-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Mot de passe oublié</CardTitle>
          <CardDescription>
            Entrez votre adresse e-mail et nous vous enverrons un lien pour
            réinitialiser votre mot de passe.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleReset}>
            {message && <p className="text-sm text-green-500">{message}</p>}
            {error && <p className="text-sm text-destructive-500">{error}</p>}

            <label className="flex flex-col gap-1">
              <span className="text-sm">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border px-3 py-2 bg-input"
              />
            </label>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Envoi…" : "Demander la réinitialisation"}
            </Button>

            <div className="text-sm text-center">
              <Link href="/auth/login" className="text-primary hover:underline">
                Retour à la connexion
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
