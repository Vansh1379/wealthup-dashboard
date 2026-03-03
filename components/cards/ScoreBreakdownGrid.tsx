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
      <h3 className="font-urbanist mb-5 text-center text-[20px] font-semibold xl:mx-auto xl:mb-0 xl:w-[1057px] xl:text-left">Your score breakdown</h3>

      <div className="hidden xl:mx-auto xl:block xl:w-[1057px]">
        <div className="relative h-[196px] w-[1057px] pt-8">
          <div className="absolute left-[340px] top-8 h-[62px] w-px bg-[#D7D7D7]" />
          <div className="absolute left-[716px] top-8 h-[62px] w-px bg-[#D7D7D7]" />
          <div className="absolute left-[340px] top-[120px] h-[62px] w-px bg-[#D7D7D7]" />
          <div className="absolute left-[716px] top-[120px] h-[62px] w-px bg-[#D7D7D7]" />

          <div className="absolute left-0 top-8 w-[300px]">{topRow[0] ? <ScoreBreakdownItem metric={topRow[0]} /> : null}</div>
          <div className="absolute left-[379px] top-8 w-[300px]">{topRow[1] ? <ScoreBreakdownItem metric={topRow[1]} /> : null}</div>
          <div className="absolute left-[757px] top-8 w-[300px]">{topRow[2] ? <ScoreBreakdownItem metric={topRow[2]} /> : null}</div>

          <div className="absolute left-0 top-[120px] w-[300px]">{bottomRow[0] ? <ScoreBreakdownItem metric={bottomRow[0]} /> : null}</div>
          <div className="absolute left-[379px] top-[120px] w-[300px]">{bottomRow[1] ? <ScoreBreakdownItem metric={bottomRow[1]} /> : null}</div>
          <div className="absolute left-[757px] top-[120px] w-[300px]">{bottomRow[2] ? <ScoreBreakdownItem metric={bottomRow[2]} /> : null}</div>
        </div>
      </div>

      <div className="mx-auto grid w-[338px] max-w-full gap-6 md:grid-cols-2 xl:hidden">
        {metrics.map((metric) => (
          <ScoreBreakdownItem key={metric.id} metric={metric} />
        ))}
      </div>
    </div>
  );
}
