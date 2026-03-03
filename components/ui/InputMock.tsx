import { TRANSITIONS } from '@/lib/constants/transitions';

export function InputMock() {
  return (
    <button
      type="button"
      className={`focus-ring h-10 w-full rounded-[20px] border border-[#294F7C]/80 bg-[rgba(248,250,252,0.7)] px-5 text-left font-urbanist text-sm italic text-[#294F7C] shadow-[2px_2px_4px_rgba(0,0,0,0.25)] hover:border-[#4B90E2] ${TRANSITIONS.base}`}
    >
      Enter amount
    </button>
  );
}
