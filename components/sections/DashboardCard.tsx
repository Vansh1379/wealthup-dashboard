import { FinancialIndependenceCard } from '@/components/cards/FinancialIndependenceCard';
import { ScoreBreakdownGrid } from '@/components/cards/ScoreBreakdownGrid';
import { ScoreGaugeCard } from '@/components/cards/ScoreGaugeCard';
import { FI_CONTENT, GAUGE_CONTENT, SCORE_BREAKDOWN } from '@/lib/constants/content';

export function DashboardCard() {
  return (
    <section className="font-urbanist mx-auto w-full max-w-[1120px] rounded-[20px] bg-[#F8FAFC] px-4 py-8 shadow-card sm:px-6 lg:px-8">
      <div className="grid gap-10 xl:grid-cols-[1fr_472px] xl:items-start">
        <ScoreGaugeCard score={GAUGE_CONTENT.score} peerText={GAUGE_CONTENT.peerText} tooltipText={GAUGE_CONTENT.tooltipText} />
        <FinancialIndependenceCard currentAge={FI_CONTENT.currentAge} potentialAge={FI_CONTENT.potentialAge} deltaText={FI_CONTENT.deltaText} />
      </div>

      <div className="mt-8 sm:mt-10">
        <ScoreBreakdownGrid metrics={SCORE_BREAKDOWN} />
      </div>
    </section>
  );
}
