import { cn } from '@/lib/utils/cn';

type PillBadgeProps = {
  children: React.ReactNode;
  tone?: 'success' | 'warning' | 'danger';
  outlined?: boolean;
  className?: string;
};

export function PillBadge({ children, tone = 'success', outlined = false, className }: PillBadgeProps) {
  const toneMap = {
    success: outlined ? 'border-[#00BA00] text-[#00BA00] bg-[#f8fafc]' : 'bg-[#00BA00] text-white',
    warning: outlined ? 'border-[#FF883E] text-[#FF883E] bg-[#f8fafc]' : 'bg-[#FF883E] text-white',
    danger: outlined ? 'border-[#FF4D4D] text-[#FF4D4D] bg-[#f8fafc]' : 'bg-[#FF4D4D] text-white',
  };

  return (
    <span className={cn('inline-flex items-center rounded-[60px] border px-2 py-1 text-xs font-semibold leading-none', toneMap[tone], className)}>
      {children}
    </span>
  );
}
