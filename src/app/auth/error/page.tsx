import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AuthErrorPage({ className }: { className?: string }) {
  return (
    <main className={cn("max-w-md mx-auto p-6", className)} title="Lien invalide ou expiré">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Lien invalide ou expiré</CardTitle>
          <CardDescription>
            Le lien que vous avez utilisé n’est plus valide. Il peut avoir
            expiré, déjà été utilisé, ou être incomplet.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href="/auth/signUp">Créer un compte</Link>
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/login">Se connecter</Link>
            </Button>

            <Button asChild variant="ghost" className="w-full">
              <Link href="/">Retour à l’accueil</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
