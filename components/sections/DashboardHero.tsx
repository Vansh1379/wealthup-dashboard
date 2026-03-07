import { Header } from '@/components/layout/Header';
import { DashboardCard } from './DashboardCard';

export function DashboardHero() {
  return (
    <section>
      <Header />
      <div className="px-4 sm:px-6 lg:px-4 xl:px-0">
        <DashboardCard />
      </div>
    </section>
  );
}
