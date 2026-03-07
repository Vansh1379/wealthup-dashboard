import type { ScoreBreakdownItemProps } from '@/lib/types/dashboard';

const toneTextClass = {
  danger: 'text-[#FF4D4D]',
  warning: 'text-[#FF883E]',
  success: 'text-[#00BA00]',
};

const toneBarClass = {
  danger: 'from-[#ff8f8f] to-[#ff6969]',
  warning: 'from-[#f5c6a2] to-[#f49314]',
  success: 'from-[#aeffae] to-[#7eff7e]',
};

export function ScoreBreakdownItem({ metric }: ScoreBreakdownItemProps) {
  return (
    <div className="relative h-[72px] w-full lg:px-6 xl:px-0">
      <div className="relative h-[44px]">
        <div className="w-[231.33px] max-w-[calc(100%-80px)]">
          <p className="text-base font-bold leading-none">
            {metric.title} <span className="text-xs font-normal text-[#8A8A8A]">{metric.scoreText}</span>
          </p>
          <p className="mt-2 text-sm font-medium leading-none">{metric.valueText}</p>
        </div>
        {metric.status ? (
          <div className={`absolute right-0 top-[30px] flex min-w-[132px] items-center justify-end gap-1 whitespace-nowrap text-xs font-semibold leading-none ${toneTextClass[metric.status.tone]}`}>
            <img src={metric.status.icon} alt="" className="size-[15px]" />
            <span>{metric.status.label}</span>
          </div>
        ) : null}
      </div>
      <div className="mt-3 h-4 overflow-hidden rounded-[30px] bg-[#F7F7F7] shadow-[inset_0_0_4px_rgba(0,0,0,0.08)]">
        <div
          className={`h-full rounded-[30px] bg-gradient-to-r ${toneBarClass[metric.progressTone]}`}
          style={{ width: `${metric.progress}%` }}
        />
      </div>
    </div>
  );
}
