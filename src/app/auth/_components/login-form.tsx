"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/client";
import { cn } from "@/lib/utils";
import { useSupabaseUser } from "../../../../hook/useSupabaseUser";
import { SignInButton } from "./_buttons/signIn";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  // const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, loading } = useSupabaseUser();
  const supabase = createClient();

  // const handleSocialLogin = async (provider: OAuthProvider) => {
  //   const supabase = createClient();
  //   setIsLoading(true);
  //   setLoadingProvider(provider);
  //   setError(null);

  //   try {
  //     // Changez '/protected' par la page de votre choix (ex: '/dashboard', '/home', '/profile')
  //     const { error } = await supabase.auth.signInWithOAuth({
  //       provider,
  //       options: {
  //         redirectTo: `${window.location.origin}/auth/oauth?next=/admin`,
  //       },
  //     });

  //     if (error) throw error;
  //   } catch (error: unknown) {
  //     setError(error instanceof Error ? error.message : "An error occurred");
  //     setIsLoading(false);
  //     setLoadingProvider(null);
  //   }
  // };

  // const handlePasswordLogin = async (e?: React.FormEvent) => {
  //   e?.preventDefault();
  //   setIsLoading(true);
  //   setError(null);

  //   try {
  //     const supabase = createClient();

  //     const { data, error } = await supabase.auth.signInWithPassword({
  //       email: email.trim(),
  //       password,
  //     });

  //     if (error) {
  //       // If user not found / invalid credentials -> redirect to sign up
  //       const msg = (error.message || "").toLowerCase();
  //       if (msg.includes("invalid") || msg.includes("no user") || msg.includes("not found")) {
  //         router.push("/auth/signUp");
  //         return;
  //       }

  //       throw error;
  //     }

  //     // Success: redirect to admin (or change this to desired route)
  //     if (data?.user) {
  //       router.push("/admin");
  //     }
  //   } catch (err: unknown) {
  //     setError(err instanceof Error ? err.message : String(err));
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Bienvenue</CardTitle>
          <CardDescription>
            Connectez-vous à votre compte pour continuer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              if (!email) return;
              setIsLoading(true);
              setError(null);
              try {
                const { data, error } = await supabase.auth.signInWithPassword({
                  email: email.trim(),
                  password,
                });

                if (error) {
                  console.error(error);
                  setError(error.message ?? "Une erreur est survenue");
                } else if (data?.user) {
                  // After successful sign in, ensure the user's profile is approved
                  try {
                    const userId = data.user.id;
                    const { data: profile, error: profileError } =
                      await supabase
                        .from("profiles")
                        .select("is_approved")
                        .eq("id", userId)
                        .maybeSingle();

                    if (profileError) {
                      console.error(profileError);
                      // If we can't read the profile, fallback to admin but surface a message
                      setError(
                        "Impossible de vérifier l'état du compte. Réessayez plus tard."
                      );
                    } else if (!profile?.is_approved) {
                      // Not approved -> send to pending page
                      router.push("/auth/pending");
                    } else {
                      // Approved -> proceed to admin
                      router.push("/admin");
                    }
                  } catch (innerErr) {
                    console.error(innerErr);
                    setError("Erreur lors de la vérification du profil");
                  }
                } else {
                  // Unexpected response
                  setError("Impossible de se connecter. Réessayez.");
                }
              } catch (err: unknown) {
                setError(err instanceof Error ? err.message : String(err));
              } finally {
                setIsLoading(false);
              }
            }}
          >
            {error && <p className="text-sm text-destructive-500">{error}</p>}

            <label className="flex flex-col gap-1">
              <span className="text-sm">Email</span>
              <input
                type="email"
                placeholder="Votre Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className=" w-full rounded-md border px-3 py-2 my-2 bg-input"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm">Mot de passe</span>
              <input
                type="password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className=" w-full rounded-md border px-3 py-2 my-2 bg-input"
              />
            </label>

            {/* <label className="flex flex-col gap-1">
              <span className="text-sm">Mot de passe</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-md border px-3 py-2 bg-input"
              />
            </label> */}

            {/* <div className="text-sm text-right">
              <Link href="/auth/forgot-password" className="text-primary hover:underline">
                Mot de passe oublié ?
              </Link>
            </div> */}

            <Button
              type="submit"
              className=" cursor-pointer w-full"
              disabled={isLoading}
            >
              {isLoading ? "Connexion…" : "Se connecter"}
            </Button>

            <div className="text-sm text-center">
              Vous n'avez pas de compte ?{" "}
              <Link
                href="/auth/signUp"
                className="text-primary hover:underline"
              >
                Créer un compte
              </Link>
            </div>

            <div className="border-t pt-3" />

            <SignInButton
              provider="google"
              className="bg-gray-500 border border-black"
            />

            <SignInButton
              provider="discord"
              className="bg-purple-900 border border-black"
            />

            <SignInButton provider="github" className="border border-black" />

            <div className="mt-4 text-sm text-gray-600">
              {loading ? "En cours..." : user ? "Connecté" : "Déconnecté"}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
