"use client";

import { useEffect, useState } from "react";
import { createClient} from "@/lib/client";
import type {Offer} from "@/types/public"
import { SectionOffersSkeleton } from "./../_skeletons/SectionOffersSkeleton";

export default function SectionOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  // const [language, setLanguage] = useState<language[] | >([]);
  const [loading, setLoading] = useState(true);
  const lang = "fr";

  useEffect(() => {
    const fetchOffers = async () => {
      const supabase = createClient(); 

      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!error) setOffers(data || []);
      setLoading(false);
    };

    fetchOffers();
  }, []);

  if (loading) return <SectionOffersSkeleton />;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">Nos offres</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {lang === "fr" ? offer.title_fr : offer.title_en}
            </h3>

            <div className="h-1 w-12 bg-blue-500/60 rounded-full mb-4"></div>

            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {lang === "fr" ? offer.long_fr : offer.long_en}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}


