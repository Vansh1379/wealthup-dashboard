import type { AdvisorCtaProps } from '@/lib/types/dashboard';
import { ADVISOR_CONTENT } from '@/lib/constants/content';
import { cn } from '@/lib/utils/cn';
import { TRANSITIONS } from '@/lib/constants/transitions';

export function FooterAdvisorCta({ className, compact = false }: AdvisorCtaProps) {
  return (
    <section className={cn('bg-gradient-to-r from-[#CFE6F7] to-[#EAF4FB]', className)}>
      <div className={cn('mx-auto flex max-w-[1120px] flex-col gap-4 px-4 py-8 sm:px-6 lg:px-0', compact ? 'items-center text-center' : 'items-center justify-between lg:flex-row')}>
        <div className={cn('flex items-center gap-4', compact && 'flex-col')}>
          <p className={cn('text-base', compact ? 'max-w-[360px]' : 'max-w-[568px]')}>{ADVISOR_CONTENT.text}</p>
          <img src={ADVISOR_CONTENT.avatar} alt="Medha" className={cn('rounded-full object-cover', compact ? 'size-[75px]' : 'size-[50px]')} />
        </div>

        <div className={cn('flex gap-3', compact ? 'w-full flex-col items-center' : 'flex-wrap')}>
          <button className={`focus-ring ${TRANSITIONS.button} inline-flex h-[43px] min-w-[220px] items-center justify-center gap-2 rounded-[30px] border border-[#00FF00] bg-transparent px-6 text-base font-semibold text-[#32D951] hover:bg-[#e8ffe8] active:translate-y-[1px]`}>
            <img src={ADVISOR_CONTENT.whatsappIcon} alt="" className="size-5" />
            Chat on WhatsApp
          </button>
          <button className={`focus-ring ${TRANSITIONS.button} inline-flex h-[43px] min-w-[220px] items-center justify-center gap-2 rounded-[30px] border border-[#294F7C] bg-transparent px-6 text-base font-semibold text-[#294F7C] hover:bg-[#e9f1fb] active:translate-y-[1px]`}>
            <img src={ADVISOR_CONTENT.calendarIcon} alt="" className="size-[25px]" />
            Schedule a call
          </button>
        </div>
      </div>
    </section>
  );
}
