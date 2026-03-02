import { HEADER_CONTENT } from '@/lib/constants/content';

export function Header() {
  return (
    <header className="mx-auto w-full max-w-[1120px] px-4 pb-6 pt-4 sm:px-6 sm:pt-8 lg:max-w-[1160px] lg:px-0">
      <img src={HEADER_CONTENT.logo} alt="Wealthup" className="h-10 w-[126px] object-contain" />
      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-inter text-2xl font-bold sm:text-[40px] sm:leading-[1.1] lg:text-[40px]">{HEADER_CONTENT.greeting}</h1>
          <p className="font-inter mt-2 text-sm sm:text-xl">{HEADER_CONTENT.subtitle}</p>
        </div>
        <div className="inline-flex h-12 items-center gap-2 self-start rounded-[80px] bg-[#E2FFE2] px-4 shadow-[0_2px_5.9px_rgba(0,0,0,0.05)]">
          <img src={HEADER_CONTENT.verifiedIcon} alt="" className="size-6" />
          <span className="text-lg text-[#098309]">{HEADER_CONTENT.verifiedLabel}</span>
        </div>
      </div>
    </header>
  );
}
