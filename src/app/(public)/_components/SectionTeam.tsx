"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import type { Team } from "@/types/public";
import { SectionTeamSkeleton } from "../../../components/skeletons/SectionTeamSkeleton";

export default function SectionTeam() {
  const [team, setTeam] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("users")
        .select("id, firstname, lastname, bio, avatar_url")
        .eq("is_public", true)
        .eq("is_approved", true);

      if (!error) setTeam(data || []);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (loading) return <SectionTeamSkeleton />;

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">
        Qui sommes-nous ?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((u) => (
          <div
            key={u.id}
            className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center"
          >
            <Image
              width={10}
              height={10}
              src={u.avatar_url ?? "/avatar.jpg"}
              alt={`${u.firstname} ${u.lastname}`}
              className="w-20 h-20 rounded-full mb-4 object-cover shadow"
            />

            <h3 className="font-semibold text-gray-900 text-lg">
              {u.firstname} {u.lastname}
            </h3>

            {u.bio && (
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                {u.bio}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
