"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import type { Step } from "@/types/public";
import { SectionWorkflowSkeleton } from "../../../components/skeletons/SectionWorkFlowSkeleton";

export default function SectionWorkflow() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const lang = "fr";

  useEffect(() => {
    const fetchSteps = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("workflow_steps")
        .select("*")
        .eq("is_active", true)
        .order("step_number", { ascending: true });

      if (!error && data) {
        setSteps(data);
      }

      setLoading(false);
    };

    fetchSteps();
  }, []);

  if (loading) return <SectionWorkflowSkeleton />;

  if (!steps || steps.length === 0) {
    return (
      <section className="mb-12 bg-red-50 border border-red-200 p-4 rounded-xl text-red-700">
        Aucune étape trouvée.
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">
        Comment travaillons-nous ?
      </h2>

      <div className="space-y-6">
        {steps.map((step) => (
          <div
            key={step.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            {/* Étiquette Étape */}
            <div className="text-sm font-semibold text-blue-600 mb-1">
              Étape {step.step_number}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {lang === "fr" ? "" : ""}
            </h3>

            {/* Ligne décorative */}
            <div className="h-1 w-10 bg-blue-500/60 rounded-full mb-4"></div>

            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {lang === "fr" ? "" : ""}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
