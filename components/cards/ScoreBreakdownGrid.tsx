import type { ScoreBreakdownMetric } from '@/lib/types/dashboard';
import { ScoreBreakdownItem } from './ScoreBreakdownItem';

type ScoreBreakdownGridProps = {
  metrics: ScoreBreakdownMetric[];
};

export function ScoreBreakdownGrid({ metrics }: ScoreBreakdownGridProps) {
  return (
    <div>
      <h3 className="mb-5 text-2xl font-semibold">Your score breakdown</h3>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <ScoreBreakdownItem key={metric.id} metric={metric} />
        ))}
      </div>
    </div>
  );
}
