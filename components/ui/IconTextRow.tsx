import { cn } from '@/lib/utils/cn';

type IconTextRowProps = {
  icon: string;
  text: string;
  className?: string;
};

export function IconTextRow({ icon, text, className }: IconTextRowProps) {
  return (
    <div className={cn('flex items-center gap-2 text-xs text-[#294F7C]', className)}>
      <img src={icon} alt="" className="size-[15px]" />
      <span>{text}</span>
    </div>
  );
}
