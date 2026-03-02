import type { FinancialIndependenceCardProps } from '@/lib/types/dashboard';

export function FinancialIndependenceCard({ currentAge, potentialAge, deltaText }: FinancialIndependenceCardProps) {
  return (
    <>
      <div className="font-urbanist relative mx-auto hidden h-[206px] w-[472px] sm:block">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap text-[20px] font-semibold text-[#294F7C]">Financial independence age</div>

        <div className="absolute left-0 top-[56px] h-[150px] w-[220px] rounded-[20px] border-b border-l border-t border-white bg-[#F9F9F9] text-center shadow-[0px_0px_24px_rgba(74,144,226,0.25)]">
          <div className="mt-6 w-[150px] mx-auto text-[14px] font-semibold tracking-[0.7px] text-[#5E5E5E]">Current Trajectory</div>
          <div className="mt-2 text-[30px] font-bold tracking-[1.5px] text-[#5E5E5E]">{currentAge}</div>
          <p className="mx-auto mt-2 w-[150px] text-[12px] tracking-[0.6px] text-[#7C7C7C]">Based on current savings you have</p>
        </div>

        <div className="absolute left-[252px] top-[56px] h-[150px] w-[220px] rounded-[20px] border border-white bg-[#EAF4FB] text-center shadow-[0px_0px_24px_rgba(74,144,226,0.25)]">
          <div className="mt-6 w-[150px] mx-auto text-[14px] font-semibold tracking-[0.7px] text-[#307ED9]">Your Potential</div>
          <div className="mt-2 text-[30px] font-bold tracking-[1.5px] text-[#294F7C]">{potentialAge}</div>
          <p className="mx-auto mt-2 w-[163px] text-[12px] tracking-[0.6px] text-[#294F7C]">By following our personalized roadmap</p>
        </div>

        <div className="absolute left-[169px] top-[119px] h-6 w-[125px]">
          <div className="absolute left-[98px] top-[-7px] h-[34px] w-[26px]">
            <span className="absolute left-[6px] top-[20px] h-0 w-0 -translate-y-1/2 border-b-[12px] border-l-[14px] border-t-[12px] border-b-transparent border-l-[#00BA00] border-t-transparent" />
          </div>
          <div className="absolute left-0 top-[1px] flex h-6 w-[104px] shadow-[-3.87px_5.24px_10.49px_-1.31px_rgba(27,33,44,0.07)]">
            <div className="relative h-6 w-[111.73px] rounded-[5.24px_0.2px_0.2px_5.24px] bg-[#00BA00] px-[7.67px] py-[5.24px] text-[9px] leading-[13.1px] text-white">
              <span className="font-bold">✨ 27 </span>
              <span className="font-semibold">years sooner !</span>
            </div>
          </div>
        </div>
      </div>

      <div className="font-urbanist relative mx-auto h-[206px] w-[338px] sm:hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap text-[20px] font-semibold text-[#294F7C]">Financial independence age</div>

        <div className="absolute left-0 top-[56px] h-[150px] w-[160px] rounded-[20px] border-b border-l border-t border-white bg-[#F8F8F8] text-center shadow-[0px_0px_24px_rgba(74,144,226,0.25)]">
          <div className="mt-6 mx-auto h-[17px] w-[150px] text-[14px] font-semibold tracking-[0.7px] text-[#5E5E5E]">Current Trajectory</div>
          <div className="mt-2 mx-auto h-9 w-9 text-[30px] font-bold tracking-[1.5px] text-[#5E5E5E]">{currentAge}</div>
          <p className="mx-auto mt-2 h-7 w-[150px] text-[12px] tracking-[0.6px] text-[#7C7C7C]">Based on current savings you have</p>
        </div>

        <div className="absolute left-[178px] top-[56px] h-[150px] w-[160px] rounded-[20px] border border-white bg-[#EAF4FB] shadow-[0px_0px_24px_rgba(74,144,226,0.25)]">
          <div className="mt-6 ml-[6px] h-[17px] w-[148px] text-center text-[14px] font-semibold tracking-[0.7px] text-[#307ED9]">Your Potential</div>
          <div className="mt-2 ml-16 h-9 w-9 text-center text-[30px] font-bold tracking-[1.5px] text-[#294F7C]">{potentialAge}</div>
          <p className="mt-2 text-center text-[12px] tracking-[0.6px] text-[#294F7C]">By following our personalized roadmap</p>
        </div>

        <div className="absolute left-[107px] top-[119px] h-6 w-[125px]">
          <div className="absolute left-[98px] top-[-7px] h-[34px] w-[26px]">
            <span className="absolute left-[6px] top-[20px] h-0 w-0 -translate-y-1/2 border-b-[12px] border-l-[14px] border-t-[12px] border-b-transparent border-l-[#00BA00] border-t-transparent" />
          </div>
          <div className="absolute left-0 top-[1px] flex h-6 w-[104px] shadow-[-3.87px_5.24px_10.49px_-1.31px_rgba(27,33,44,0.07)]">
            <div className="relative h-6 w-[120.73px] rounded-[5.24px_0.2px_0.2px_5.24px] bg-[#00BA00] px-[7.87px] py-[5.24px] text-[9px] leading-[13.1px] text-white">
              <span className="font-bold">✨ 27</span>
              <span className="font-semibold"> years sooner !</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
