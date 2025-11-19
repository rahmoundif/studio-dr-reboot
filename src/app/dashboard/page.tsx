import { redirect } from "next/navigation";
import { LogoutButton } from "@/app/auth/_components/logout-button";
import { createClient } from "@/lib/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  // Récupérer les métadonnées de l'utilisateur
  const metadata = user.user_metadata;
  const onboarded = metadata?.onboarded === true;
  const status = metadata?.status || "unknown";
  const firstLoginAt = metadata?.first_login_at;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-4xl font-bold">Dashboard</h1>

        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Informations utilisateur</h2>

          <div className="space-y-2">
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-medium">Provider:</span>{" "}
              {user.app_metadata.provider || "N/A"}
            </p>
            <p>
              <span className="font-medium">Statut:</span>{" "}
              <span
                className={`px-2 py-1 rounded text-sm ${
                  status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {status}
              </span>
            </p>
            <p>
              <span className="font-medium">Onboarding:</span>{" "}
              <span
                className={`px-2 py-1 rounded text-sm ${
                  onboarded
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {onboarded ? "✓ Complété" : "○ En attente"}
              </span>
            </p>
            {firstLoginAt && (
              <p>
                <span className="font-medium">Première connexion:</span>{" "}
                {new Date(firstLoginAt).toLocaleString("fr-FR")}
              </p>
            )}
            <p>
              <span className="font-medium">Dernière connexion:</span>{" "}
              {user.last_sign_in_at
                ? new Date(user.last_sign_in_at).toLocaleString("fr-FR")
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Métadonnées complètes</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(metadata, null, 2)}
          </pre>
        </div>

        <LogoutButton />
      </div>
    </div>
  );
}
