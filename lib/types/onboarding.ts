export type OnboardingSidebarItem = {
  id: number;
  title: string;
  eta: string;
  icon: string;
};

export type OnboardingStepContent = {
  id: number;
  slug: string;
  mobileStepLabel: string;
  progress: number;
  currentSidebarStage: number;
  title: string;
  subtitle: string;
  fields: Array<{ label: string; value?: string; rounded?: 'pill' | 'soft' }>;
  question?: string;
  selectedTaxResident?: 'yes' | 'no';
  showSelfieUpload?: boolean;
  showSendOtp?: boolean;
  showSkip?: boolean;
  showOtpField?: boolean;
  resendText?: string;
  nextStepHref?: string;
  prevStepHref?: string;
};
