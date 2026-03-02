import { cn } from '@/lib/utils/cn';
import { TRANSITIONS } from '@/lib/constants/transitions';

type GradientButtonProps = {
  children: React.ReactNode;
  className?: string;
};

export function GradientButton({ children, className }: GradientButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'focus-ring rounded-[20px] bg-gradient-to-r from-[#294F7C] to-[#4B90E2] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-105 active:translate-y-[1px]',
        TRANSITIONS.button,
        className,
      )}
    >
      {children}
    </button>
  );
}
