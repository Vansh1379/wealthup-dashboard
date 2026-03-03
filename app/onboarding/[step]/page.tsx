import { notFound } from 'next/navigation';
import { getOnboardingStep, ONBOARDING_STEPS } from '@/lib/constants/onboarding';
import { OnboardingShell } from '@/components/onboarding/OnboardingShell';

export function generateStaticParams() {
  return ONBOARDING_STEPS.map((item) => ({ step: String(item.id) }));
}

export default async function OnboardingStepPage({ params }: { params: Promise<{ step: string }> }) {
  const { step } = await params;
  const stepData = getOnboardingStep(step);

  if (!stepData) {
    notFound();
  }

  return <OnboardingShell step={stepData} />;
}
