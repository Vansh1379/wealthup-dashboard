import { notFound } from 'next/navigation';
import { getOnboardingStep } from '@/lib/constants/onboarding';
import { OnboardingShell } from '@/components/onboarding/OnboardingShell';

export function generateStaticParams() {
  return [{ step: '1' }, { step: '2' }, { step: '3' }, { step: '4' }];
}

export default async function OnboardingStepPage({ params }: { params: Promise<{ step: string }> }) {
  const { step } = await params;
  const stepData = getOnboardingStep(step);

  if (!stepData) {
    notFound();
  }

  return <OnboardingShell step={stepData} />;
}
