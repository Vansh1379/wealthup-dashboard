import { FooterAdvisorCta } from '@/components/layout/FooterAdvisorCta';
import { DashboardHero } from '@/components/sections/DashboardHero';
import { RoadmapSection } from '@/components/sections/RoadmapSection';

export default function Page() {
  return (
    <main className="min-h-screen bg-[linear-gradient(113deg,#ECF4FB_0%,#F8FAFC_100%)]">
      <div className="mx-auto max-w-[1440px] pb-0">
        <DashboardHero />
        <RoadmapSection />
      </div>
      <FooterAdvisorCta compact={false} className="hidden lg:block" />
      <FooterAdvisorCta compact className="lg:hidden" />
    </main>
  );
}
