"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import type { Details } from "@/types/public";
import { SectionWorkSkeleton } from "../../../components/skeletons/SectionWorkSkeleton";

export default function SectionWork() {
  const [detail, setDetail] = useState<Details | null>(null);
  const [loading, setLoading] = useState(true);
  const lang = "fr"; // TODO: dynamique plus tard

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("content_sections")
        .select("*")
        .eq("slug", "notre-travail")
        .single();

      if (!error) {
        setDetail(data);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <SectionWorkSkeleton />;

  if (!detail) {
    return (
      <section className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
        Impossible de charger la section.
      </section>
    );
  }

  return (
    <section className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-semibold mb-3 text-gray-900">
        {lang === "fr" ? "" : ""}
      </h2>

      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
        {lang === "fr" ? "" : ""}
      </p>
    </section>
  );
}
