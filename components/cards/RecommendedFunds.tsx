import type { RecommendedFund } from '@/lib/types/dashboard';

type RecommendedFundsProps = {
  funds: RecommendedFund[];
};

export function RecommendedFunds({ funds }: RecommendedFundsProps) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-[#294F7C]">Recommended Funds</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {funds.map((fund) => (
          <div key={fund.id} className="flex items-center gap-3 rounded-[10px] bg-[#EAF4FB] px-3 py-2">
            <img src={fund.icon} alt="" className="h-6 w-6 object-contain" />
            <div>
              <p className="text-[10px] font-semibold text-[#363636]">{fund.name}</p>
              <p className="text-[8px] font-medium text-[#00BA00]">{fund.cagr}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
