import type { ScoreGaugeCardProps } from '@/lib/types/dashboard';
import { GAUGE_CONTENT } from '@/lib/constants/content';

export function ScoreGaugeCard({ score }: ScoreGaugeCardProps) {
  return (
    <>
      <div className="font-urbanist group relative mx-auto hidden h-[271px] w-[398px] sm:block" data-node-id="0:5624">
        <p className="h-6 w-[398px] whitespace-nowrap text-center text-[24px] font-bold leading-none text-[#294F7C]">Wealth Score</p>
        <p className="pointer-events-none absolute left-0 top-0 h-6 w-[398px] whitespace-nowrap text-center text-[24px] font-bold leading-none text-[#294F7C] opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          Wealth Score
        </p>

        <div className="relative ml-[42px] mt-[32px] h-[214.99px] w-[319px]">
          <div className="relative flex w-[317px]">
            <div className="relative h-[172.44px] w-[321px]">
              <img className="absolute left-0 top-0 h-[172px] w-[317px]" alt="" src={GAUGE_CONTENT.desktopBgArc} />
              <img className="absolute left-[17px] top-[13px] h-[141px] w-[280px]" alt="" src={GAUGE_CONTENT.desktopStrokeArc} />
              <img className="absolute left-[15px] top-10 h-[117px] w-[71px]" alt="" src={GAUGE_CONTENT.desktopProgressArc} />
              <img
                className="absolute left-[215px] top-[32px] h-[20px] w-[19px]"
                alt=""
                src={GAUGE_CONTENT.desktopNeedle}
              />
              <div className="font-inter absolute left-[131px] top-[54px] w-14 text-center text-[36px] font-bold leading-none text-[#FF6A6A]">{score}</div>
              <div className="absolute left-1/2 top-[126px] w-[122px] -translate-x-1/2 text-center text-[14px] font-normal text-[#294F7C] underline decoration-[0.8px] underline-offset-[2px]">
                Improve Accuracy
              </div>
            </div>
          </div>

          <p className="absolute left-1/2 top-[195px] h-[19.03px] w-[174px] -translate-x-1/2 whitespace-nowrap text-[16px] italic text-[#294F7C]">
            Better than <span className="font-bold">46%</span> of peers
          </p>
        </div>

        <div className="font-inter pointer-events-none absolute left-[225px] top-[30px] h-[70px] w-[168px] translate-x-4 translate-y-3 scale-[0.96] blur-md opacity-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:translate-x-0 group-hover:translate-y-0 group-hover:scale-100 group-hover:blur-0 group-hover:opacity-100">
          <div className="rounded-[8px] bg-white px-3 py-2 text-center text-[12px] leading-5 text-[#294F7C] shadow-[0px_8px_16px_-2px_rgba(27,33,44,0.12)]">
            You need <span className="font-bold">+27</span> points to reach a <span className="font-bold text-[#00BA00]">good</span> score of <span className="font-bold">70</span>
          </div>
          <div className="absolute left-[22px] top-[55px] flex h-[14px] w-[20px] items-center justify-center">
            <img className="h-[35px] w-[25px] " alt="" src={GAUGE_CONTENT.mobileTooltipPointer} />
          </div>
        </div>
      </div>

      <div className="font-urbanist relative mx-auto h-[283px] w-[342px] sm:hidden" data-node-id="0:5846">
        <div className="absolute left-1/2 top-0 w-[338px] -translate-x-1/2 text-center text-[24px] font-bold leading-none text-[#294F7C]">Wealth Score</div>

        <div className="absolute left-5 top-[91px] flex h-[162px] w-[298px]">
          <div className="relative h-[161.52px] w-[301.69px]">
            <img className="absolute left-0 top-0 h-[162px] w-[298px]" alt="" src={GAUGE_CONTENT.mobileBgArc} />
            <img className="absolute left-4 top-3 h-[132px] w-[263px]" alt="" src={GAUGE_CONTENT.mobileStrokeArc} />
            <img className="absolute left-4 top-[41px] h-[104px] w-[61px]" alt="" src={GAUGE_CONTENT.mobileProgressArc} />
            <img
              className="absolute left-[215px] top-[37px] h-[20px] w-[19px]"
              alt=""
              src={GAUGE_CONTENT.desktopNeedle}
            />

            <div className="font-inter absolute left-[123px] top-[51px] w-[53px] text-center text-[24px] font-bold leading-none text-[#FF6A6A]">{score}</div>
            <div className="absolute left-1/2 top-[118px] w-[122px] -translate-x-1/2 text-center text-[14px] font-normal tracking-[0.7px] text-[#294F7C] underline decoration-[0.8px] underline-offset-[2px]">
              Improve Accuracy
            </div>
          </div>
        </div>

        <div className="absolute left-[145px] top-[65px] h-[70px] w-[191px]">
          <div className="inline-flex flex-col items-start rounded-[8px] bg-white px-3 py-2 shadow-[0px_8px_16px_-2px_rgba(27,33,44,0.12)]">
            <p className="font-inter w-[168px] text-[14px] leading-5 text-[#294F7C]">
              You need <span className="font-bold">+27</span> points to reach a <span className="font-bold text-[#00BA00]">good</span> score of <span className="font-bold">70</span>
            </p>
          </div>

          <div className="absolute left-[89px] top-[53px] inline-flex rotate-90 flex-col items-center gap-2.5">
            <img
              className="h-[12.55px] w-5 -rotate-90"
              alt=""
              src={GAUGE_CONTENT.mobileTooltipPointer}
            />
          </div>
        </div>

        <p className="absolute left-1/2 top-[265px] w-[176px] -translate-x-1/2 whitespace-nowrap text-[16px] italic text-[#294F7C]">
          Better than <span className="font-bold">46%</span> of peers
        </p>
      </div>
    </>
  );
}
