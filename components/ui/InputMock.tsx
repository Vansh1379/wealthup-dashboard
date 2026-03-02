import { TRANSITIONS } from '@/lib/constants/transitions';

export function InputMock() {
  return (
    <button
      type="button"
      className={`focus-ring h-10 w-full rounded-[10px] border border-[#BCD0E8] bg-white/40 px-5 text-left text-sm italic text-[#5E5E5EE5] hover:border-[#4B90E2] ${TRANSITIONS.base}`}
    >
      Enter amount
    </button>
  );
}
