import type { OnboardingSidebarItem, OnboardingStepContent } from '@/lib/types/onboarding';

export const ONBOARDING_SIDEBAR_ITEMS: OnboardingSidebarItem[] = [
  { id: 1, title: 'Check your KYC', eta: 'Estimated Time: 20 sec', icon: '/assets/onboarding/sidebar/check-kyc.svg' },
  { id: 2, title: 'Details from MFCentral', eta: 'Estimated Time: 20 sec', icon: '/assets/onboarding/sidebar/details-mfcentral.svg' },
  { id: 3, title: 'Personal Details', eta: 'Estimated Time: 20 sec', icon: '/assets/onboarding/sidebar/personal-details.svg' },
  { id: 4, title: 'Tax Details', eta: 'Estimated Time: 20 sec', icon: '/assets/onboarding/sidebar/tax-details.svg' },
  { id: 5, title: 'Bank Details', eta: 'Estimated Time: 20 sec', icon: '/assets/onboarding/sidebar/bank-details.svg' },
  { id: 6, title: 'Nominee Details', eta: 'Estimated Time: 20 sec', icon: '/assets/onboarding/sidebar/nominee-details.svg' },
];

export const ONBOARDING_STEPS: OnboardingStepContent[] = [
  {
    id: 1,
    slug: '1',
    mobileStepLabel: 'Step 1: Check your KYC',
    progress: 18,
    currentSidebarStage: 1,
    title: 'Check your KYC',
    subtitle: 'Verify your identity to keep your account secure and compliant.',
    fields: [{ label: 'Pan Number', value: 'ABCDE1234F', rounded: 'soft' }],
    question: 'Are you a tax resident of any country other than India?',
    selectedTaxResident: 'no',
    nextStepHref: '/onboarding/2',
    prevStepHref: '/onboarding/1',
  },
  {
    id: 2,
    slug: '2',
    mobileStepLabel: 'Step 1: Check your KYC',
    progress: 34,
    currentSidebarStage: 1,
    title: 'KYC Verification Required',
    subtitle: 'This helps us protect your account and investments.',
    fields: [
      { label: 'Name', rounded: 'pill' },
      { label: 'Email', rounded: 'pill' },
      { label: 'Mobile Number', rounded: 'pill' },
      { label: 'Upload Selfie', rounded: 'soft' },
    ],
    showSelfieUpload: true,
    nextStepHref: '/onboarding/3',
    prevStepHref: '/onboarding/1',
  },
  {
    id: 3,
    slug: '3',
    mobileStepLabel: 'Step 2: Details from MFCentral',
    progress: 52,
    currentSidebarStage: 2,
    title: 'Details from MFCentral',
    subtitle: 'Let’s gather what you already have, so you don’t start from scratch.',
    fields: [
      { label: 'Pan Number', rounded: 'soft' },
      { label: 'Mobile Number', rounded: 'soft' },
    ],
    showSendOtp: true,
    showSkip: true,
    nextStepHref: '/onboarding/4',
    prevStepHref: '/onboarding/2',
  },
  {
    id: 4,
    slug: '4',
    mobileStepLabel: 'Step 2: Details from MFCentral',
    progress: 68,
    currentSidebarStage: 2,
    title: 'Details from MFCentral',
    subtitle: 'Let’s gather what you already have, so you don’t start from scratch.',
    fields: [
      { label: 'Pan Number', rounded: 'soft' },
      { label: 'Mobile Number', rounded: 'soft' },
      { label: 'Enter OTP', rounded: 'soft' },
    ],
    showOtpField: true,
    resendText: 'Resend OTP in 30 seconds',
    nextStepHref: '/',
    prevStepHref: '/onboarding/3',
  },
];

export const TRUST_ITEMS = [
  { icon: '/assets/onboarding/trust/no-spam.svg', text: 'No spam calls.' },
  { icon: '/assets/onboarding/trust/private-secure.svg', text: 'Your data is private and secure' },
  { icon: '/assets/onboarding/trust/no-sell.svg', text: "We don't sell your data." },
];

export function getOnboardingStep(stepParam: string) {
  const normalized = stepParam.startsWith('step-') ? stepParam.replace('step-', '') : stepParam;
  const step = Number.parseInt(normalized, 10);
  if (!Number.isFinite(step)) return null;
  return ONBOARDING_STEPS.find((item) => item.id === step) ?? null;
}
