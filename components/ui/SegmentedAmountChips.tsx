import { TRANSITIONS } from '@/lib/constants/transitions';

const amounts = ['₹500', '₹1000', '₹2500', '₹5000'];

export function SegmentedAmountChips() {
  return (
    <div className="flex flex-wrap gap-3">
      {amounts.map((amount) => (
        <button
          key={amount}
          type="button"
          className={`focus-ring rounded-[15px] bg-[#EAF4FB] px-3 py-1.5 text-xs font-semibold text-[#294F7C] hover:bg-[#d7eafb] active:translate-y-[1px] ${TRANSITIONS.chip}`}
        >
          {amount}
        </button>
      ))}
    </div>
  );
}
