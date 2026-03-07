import { HEADER_CONTENT } from '@/lib/constants/content';

export function Header() {
  const [greetingPrefix, greetingNameWithPunctuation = ''] = HEADER_CONTENT.greeting.split(',');
  const subtitleMatch = HEADER_CONTENT.subtitle.match(/^At\s+(\d+)(.*)$/);

  return (

    <header className="mx-auto w-full max-w-[1120px] px-4 pb-6 pt-4 sm:px-6 sm:pt-8 lg:px-4 xl:px-0">
      <img src={HEADER_CONTENT.logo} alt="Wealthup" className="h-10 w-[126px] object-contain" />
      <div className="mt-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>

          <h1 className="font-urbanist text-2xl font-normal leading-normal text-[#294F7C]">
            {greetingPrefix},
            <span className="font-bold">{greetingNameWithPunctuation}</span>
          </h1>
          <p className="font-urbanist mt-2 text-xl font-normal leading-normal text-[#294F7C]">
            {subtitleMatch ? (
              <>
                At <span className="font-bold">{subtitleMatch[1]}</span>
                {subtitleMatch[2]}
              </>
            ) : (
              HEADER_CONTENT.subtitle
            )}
          </p>
        </div>
        <div className="inline-flex h-12 items-center gap-2 self-start rounded-[80px] bg-[#E2FFE2] px-4 shadow-[0_2px_5.9px_rgba(0,0,0,0.05)]">
          <img src={HEADER_CONTENT.verifiedIcon} alt="" className="size-6" />
          <span className="text-lg text-[#098309]">{HEADER_CONTENT.verifiedLabel}</span>
        </div>
      </div>
    </header>
  );
}
