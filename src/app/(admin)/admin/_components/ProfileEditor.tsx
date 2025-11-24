"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import type { Profile } from "@/types/admin";

export default function ProfileEditor() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();

      try {
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          setMessage("Impossible de charger votre profil. Veuillez réessayer.");
          return;
        }

        const user = data?.user;

        if (!user) {
          setMessage("Aucun utilisateur connecté");
          return;
        }

        const { data: info, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          setMessage("Impossible de charger votre profil.");
          return;
        }

        setProfile(info as Profile);
      } catch {
        setMessage("Une erreur inattendue s'est produite.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const save = async () => {
    if (!profile) return;

    const supabase = createClient();

    const { error } = await supabase
      .from("users")
      .update({
        firstname: profile.firstname,
        lastname: profile.lastname,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        pseudo: profile.pseudo,
      })
      .eq("id", profile.id);

    setMessage(error ? "sauvegarde echoué" : "Profil sauvegardé.");
  };

  if (loading) {
    return <p className="text-gray-300">Chargement du profil...</p>;
  }

  if (!profile) {
    return (
      <p className="text-red-400">Aucun profil trouvé pour cet utilisateur.</p>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded">
      <div className="grid gap-2">
        <input
          className="border p-2 rounded bg-gray-700 text-white"
          placeholder="Prénom"
          value={profile.firstname || ""}
          onChange={(e) =>
            setProfile({ ...profile, firstname: e.target.value })
          }
        />
        <input
          className="border p-2 rounded bg-gray-700 text-white"
          placeholder="Nom"
          value={profile.lastname || ""}
          onChange={(e) => setProfile({ ...profile, lastname: e.target.value })}
        />
        <input
          className="border p-2 rounded bg-gray-700 text-white"
          placeholder="Pseudo (optionnel)"
          value={profile.pseudo || ""}
          onChange={(e) => setProfile({ ...profile, pseudo: e.target.value })}
        />
        <textarea
          className="border p-2 rounded bg-gray-700 text-white"
          placeholder="Bio"
          rows={4}
          value={profile.bio || ""}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        />
        <input
          className="border p-2 rounded bg-gray-700 text-white"
          placeholder="Avatar URL"
          value={profile.avatar_url || ""}
          onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
        />
      </div>

      <button
        type="button"
        onClick={save}
        className="bg-blue-600 mt-4 px-3 py-2 rounded text-white"
      >
        Sauvegarder
      </button>

      {message && <p className="mt-2 text-green-400">{message}</p>}
    </div>
  );
}
