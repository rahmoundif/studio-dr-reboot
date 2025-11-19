"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";

export default function AdminDashboard() {
  const [count, setCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const fetchSections = async () => {
      const { data, error } = await supabase
        .from("content_sections")
        .select("id");

      if (!error) {
        setCount(data?.length ?? 0);
      }
    };

    fetchSections();
  }, [supabase]);

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Tableau de bord</h1>

      <div className="bg-gray-800 p-4 rounded shadow text-center">
        <p className="text-lg">
          Nombre de sections : <b>{count}</b>
        </p>
      </div>

      <div className="mt-6 flex gap-4">
        <Link
          href="/admin/profil"
          className="bg-blue-600 px-3 py-2 rounded text-white"
        >
          Profil
        </Link>

        <Link
          href="/admin/section"
          className="bg-green-600 px-3 py-2 rounded text-white"
        >
          Sections
        </Link>
      </div>
    </section>
  );
}
