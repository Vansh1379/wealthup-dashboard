import type { RoadmapCardProps } from '@/lib/types/dashboard';
import { GradientButton } from '@/components/ui/GradientButton';
import { InputMock } from '@/components/ui/InputMock';
import { SegmentedAmountChips } from '@/components/ui/SegmentedAmountChips';
import { IconTextRow } from '@/components/ui/IconTextRow';
import { PillBadge } from '@/components/ui/PillBadge';
import { RecommendedFunds } from './RecommendedFunds';

export function RoadmapCard({ action }: RoadmapCardProps) {
  return (
    <article className="card-hover flex h-full flex-col rounded-[20px] border bg-[#F8FAFC] p-4 sm:p-6" style={{ borderColor: action.severityTone === 'danger' ? '#FF4D4D' : '#FF883E' }}>
      <div className="mb-4 h-[127px]">
        <div className="mb-3 flex min-h-[22px] items-start justify-between gap-3">
          <h4 className="w-[180px] text-lg font-semibold leading-[22px] text-[22px]">{action.title}</h4>
          <div className="flex min-w-[132px] items-center justify-end gap-1 whitespace-nowrap text-xs font-medium" style={{ color: action.severityTone === 'danger' ? '#FF4D4D' : '#FF883E' }}>
            <img src={action.severityTone === 'danger' ? '/assets/icons/status-danger.svg' : '/assets/icons/status-warning.svg'} alt="" className="size-[15px]" />
            {action.severity}
          </div>
        </div>
        <p className="h-[80px] overflow-hidden text-sm leading-5">{action.description}</p>
      </div>

      <p className="mb-2 text-sm font-semibold">I want to start with</p>

      <div className="mb-3">
        <InputMock />
      </div>
      <div className="mb-4">
        <SegmentedAmountChips />
      </div>

      <div className="mb-5">
        <RecommendedFunds funds={action.funds} />
      </div>

      <div className="mt-auto space-y-3">
        <div className="relative">
          <GradientButton className="w-full">{action.primaryCta}</GradientButton>
          {action.points ? <PillBadge outlined className="absolute right-3 top-2.5">{action.points}</PillBadge> : null}
        </div>
        <IconTextRow icon="/assets/icons/bolt.svg" text={action.infoRow} />
      </div>
    </article>
  );
}
