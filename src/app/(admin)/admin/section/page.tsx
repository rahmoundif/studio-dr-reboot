"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import SectionEditor from "@/app/(admin)/admin/_components/SectionEditor";
import { createClient } from "@/lib/client";

interface Section {
  id: string;
  slug: string;
  title_fr: string;
  title_en: string;
  body_fr: string;
  body_en: string;
}

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  const loadSections = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("content_sections")
        .select("*")
        .order("slug");

      if (error) {
        setMessage("Chargement échoué");
        return;
      }

      setSections(data ?? []);
      setMessage(null);
    } catch {
      setMessage("Erreur réseau inatendue");
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  const handleAdd = useCallback(async () => {
    const slug = prompt("Nom de la nouvelle section ?");
    if (!slug) return;

    try {
      const { error } = await supabase
        .from("content_sections")
        .insert({ slug });
      if (error) {
        setMessage("Création de la section échoué");
        return;
      }
      await loadSections();
    } catch {
      setMessage("Erreur lors de la création");
    }
  }, [supabase, loadSections]);

  useEffect(() => {
    loadSections();
  }, [loadSections]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestion des sections</h1>

      {message && <p className="mb-4 text-sm text-red-500">{message}</p>}

      <button
        type="button"
        onClick={handleAdd}
        className="bg-blue-600 px-3 py-2 rounded text-white mb-4 disabled:opacity-60"
        disabled={isLoading}
      >
        {isLoading ? "Chargement…" : "+ Ajouter une section"}
      </button>

      <div className="flex flex-col gap-4">
        {sections.map((s) => (
          <SectionEditor key={s.id} section={s} reload={loadSections} />
        ))}
      </div>
    </div>
  );
}
