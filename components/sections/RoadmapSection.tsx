import { RoadmapCard } from '@/components/cards/RoadmapCard';
import { ROADMAP_ACTIONS } from '@/lib/constants/content';

export function RoadmapSection() {
  return (
    <section className="font-urbanist mx-auto w-full max-w-[1120px] px-4 pb-10 pt-10 sm:px-6 lg:px-8 lg:pt-14 xl:px-0">
      <h2 className="mb-8 text-1xl font-semibold sm:text-[20px]">
        Your Personalised Roadmap <span className="font-normal">to Achieve </span>
        <span className="font-bold">70+</span>
        <span className="font-normal"> Score</span>
      </h2>

      <div className="grid gap-5 lg:grid-cols-3">
        {ROADMAP_ACTIONS.map((action) => (
          <RoadmapCard key={action.id} action={action} />
        ))}
      </div>
    </section>
  );
}
