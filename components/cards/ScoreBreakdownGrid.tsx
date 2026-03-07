import type { ScoreBreakdownMetric } from '@/lib/types/dashboard';
import { ScoreBreakdownItem } from './ScoreBreakdownItem';

type ScoreBreakdownGridProps = {
  metrics: ScoreBreakdownMetric[];
};

export function ScoreBreakdownGrid({ metrics }: ScoreBreakdownGridProps) {
  const byId = Object.fromEntries(metrics.map((metric) => [metric.id, metric])) as Record<string, ScoreBreakdownMetric>;

  const topRow = [byId.savings, byId.liquidity, byId['emergency-funds']].filter(Boolean);
  const bottomRow = [byId['life-insurance'], byId['health-insurance'], byId.investments].filter(Boolean);

  return (
    <div>
      <h3 className="font-urbanist mb-5 text-center text-[20px] font-semibold md:text-left lg:mx-auto lg:w-full lg:max-w-[1120px] xl:mb-0 xl:ml-6 xl:mr-auto xl:w-[1069px]">Your score breakdown</h3>

      <div className="hidden xl:ml-6 xl:mr-auto xl:block xl:w-[1069px]">
        <div className="relative h-[196px] w-[1069px] pt-8">
          <div className="absolute left-[346px] top-8 h-[62px] w-px bg-[#D7D7D7]" />
          <div className="absolute left-[724px] top-8 h-[62px] w-px bg-[#D7D7D7]" />
          <div className="absolute left-[346px] top-[120px] h-[62px] w-px bg-[#D7D7D7]" />
          <div className="absolute left-[724px] top-[120px] h-[62px] w-px bg-[#D7D7D7]" />

          <div className="absolute left-0 top-8 w-[312px]">{topRow[0] ? <ScoreBreakdownItem metric={topRow[0]} /> : null}</div>
          <div className="absolute left-[379px] top-8 w-[312px]">{topRow[1] ? <ScoreBreakdownItem metric={topRow[1]} /> : null}</div>
          <div className="absolute left-[757px] top-8 w-[312px]">{topRow[2] ? <ScoreBreakdownItem metric={topRow[2]} /> : null}</div>

          <div className="absolute left-0 top-[120px] w-[312px]">{bottomRow[0] ? <ScoreBreakdownItem metric={bottomRow[0]} /> : null}</div>
          <div className="absolute left-[379px] top-[120px] w-[312px]">{bottomRow[1] ? <ScoreBreakdownItem metric={bottomRow[1]} /> : null}</div>
          <div className="absolute left-[757px] top-[120px] w-[312px]">{bottomRow[2] ? <ScoreBreakdownItem metric={bottomRow[2]} /> : null}</div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-full gap-6 md:grid-cols-2 lg:max-w-[1120px] lg:grid-cols-3 lg:gap-5 xl:hidden">
        {metrics.map((metric) => (
          <ScoreBreakdownItem key={metric.id} metric={metric} />
        ))}
      </div>
    </div>
  );
}
