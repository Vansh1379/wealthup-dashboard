import type { AdvisorCtaProps } from '@/lib/types/dashboard';
import { ADVISOR_CONTENT } from '@/lib/constants/content';
import { cn } from '@/lib/utils/cn';
import { TRANSITIONS } from '@/lib/constants/transitions';

export function FooterAdvisorCta({ className, compact = false }: AdvisorCtaProps) {
  if (compact) {
    return (
      <section className={cn('bg-gradient-to-r from-[#CFE6F7] to-[#EAF4FB]', className)}>
        <div className="mx-auto w-full max-w-[1120px] px-4 py-8 sm:px-6">
          <p className="mx-auto max-w-[360px] text-center font-urbanist text-base font-medium leading-tight text-[#294F7C]">
            {ADVISOR_CONTENT.text}
          </p>

          <div className="mx-auto mt-5 flex w-full max-w-[560px] items-center justify-center gap-5 sm:mt-7 sm:gap-8">
            <img src={ADVISOR_CONTENT.avatar} alt="Medha" className="size-[75px] rounded-[40px] object-cover" />

            <div className="flex w-[220px] flex-col gap-4">
              <button className={`focus-ring ${TRANSITIONS.button} inline-flex h-[43px] w-[240px] items-center justify-center gap-2 rounded-[30px] border border-[#00FF00] bg-transparent px-6 text-base font-semibold text-[#32D951] hover:bg-[#e8ffe8] active:translate-y-[1px]`}>
                <img src={ADVISOR_CONTENT.whatsappIcon} alt="" className="size-5" />
                Chat on WhatsApp
              </button>
              <button className={`focus-ring ${TRANSITIONS.button} inline-flex h-[43px] w-[220px] items-center justify-center gap-2 rounded-[30px] border border-[#294F7C] bg-transparent px-6 text-base font-semibold text-[#294F7C] hover:bg-[#e9f1fb] active:translate-y-[1px]`}>
                <img src={ADVISOR_CONTENT.calendarIcon} alt="" className="size-[25px]" />
                Schedule a call
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn('bg-[linear-gradient(90deg,#CFE6F7_0%,#EAF4FB_52.404%)]', className)}>
      <div className="mx-auto flex max-w-[1120px] flex-col items-center justify-between gap-4 px-4 py-7 sm:px-6 lg:flex-row lg:px-8 xl:px-8">
        <div className="flex items-center gap-[10px]">
          <p className="font-urbanist lg:w-[520px] xl:w-[568px] text-base font-medium leading-normal text-[#294F7C]">{ADVISOR_CONTENT.text}</p>
          <img src={ADVISOR_CONTENT.avatar} alt="Medha" className="size-[50px] rounded-full object-cover" />
        </div>

        <div className="flex flex-nowrap items-center gap-[10px]">
          <button className={`focus-ring ${TRANSITIONS.button} inline-flex h-[43px] w-[250px] items-center justify-center gap-2 rounded-[30px] border border-[#00FF00] bg-transparent px-6 text-base font-semibold text-[#32D951] hover:bg-[#e8ffe8] active:translate-y-[1px]`}>
            <img src={ADVISOR_CONTENT.whatsappIcon} alt="" className="size-5" />
            Chat on WhatsApp
          </button>
          <button className={`focus-ring ${TRANSITIONS.button} inline-flex h-[43px] w-[220px] items-center justify-center gap-2 rounded-[30px] border border-[#294F7C] bg-transparent px-6 text-base font-semibold text-[#294F7C] hover:bg-[#e9f1fb] active:translate-y-[1px]`}>
            <img src={ADVISOR_CONTENT.calendarIcon} alt="" className="size-[25px]" />
            Schedule a call
          </button>
        </div>
      </div>
    </section>
  );
}
