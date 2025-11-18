import SectionWork from './_components/SectionWork';
import SectionTeam from './_components/SectionTeam';
import SectionOffers from './_components/SectionOffers';
import SectionPricing from './_components/SectionPricing';
import SectionWorkflow from './_components/SectionWorkFlow';
import SectionContact from './_components/SectionContact';
import BackToTop from './../../components/ui/backToTop';

export default function HomePage() {
  return (
    <div className="space-y-16">
      
      {/* SECTION 1 — Notre travail */}
      <section id="notre-travail" className="scroll-mt-24">
        <SectionWork />
      </section>

      {/* SECTION 2 — Qui sommes-nous */}
      <section id="qui-sommes-nous" className="scroll-mt-24">
        <SectionTeam />
      </section>

      {/* SECTION 3 — Nos offres */}
      <section id="nos-offres" className="scroll-mt-24">
        <SectionOffers />
      </section>

      {/* SECTION 4 — Nos tarifs */}
      <section id="nos-tarifs" className="scroll-mt-24">
        <SectionPricing />
      </section>

      {/* SECTION 5 — Comment travaillons-nous */}
      <section id="comment-travaillons-nous" className="scroll-mt-24">
        <SectionWorkflow />
      </section>

      {/* SECTION 6 - Contact */}
      <section id="contact">
       <SectionContact />
      </section>

        <BackToTop />

    </div>
  );
}
