import type { RoadmapAction, ScoreBreakdownMetric } from '@/lib/types/dashboard';

export const HEADER_CONTENT = {
  greeting: 'Good Morning, Ankit!',
  subtitle: 'At 28, your income is strong, but your wealth efficiency is lagging.',
  logo: '/assets/logos/wealthup-logo.png',
  verifiedLabel: 'Verified Analysis',
  verifiedIcon: '/assets/icons/verified-check.svg',
};

export const GAUGE_CONTENT = {
  score: 43,
  peerText: 'Better than 46% of peers',
  tooltipText: 'You need +27 points to reach a good score of 70',
  desktopBgArc: '/assets/illustrations/gauge-desktop-ellipse-17.svg',
  desktopStrokeArc: '/assets/illustrations/gauge-desktop-ellipse-18-stroke.svg',
  desktopProgressArc: '/assets/illustrations/gauge-desktop-ellipse-19.svg',
  desktopNeedle: '/assets/illustrations/gauge-desktop-line-123.svg',
  mobileBgArc: '/assets/illustrations/gauge-mobile-ellipse-17.svg',
  mobileStrokeArc: '/assets/illustrations/gauge-mobile-ellipse-18-stroke.svg',
  mobileProgressArc: '/assets/illustrations/gauge-mobile-ellipse-19.svg',
  mobileNeedle: '/assets/illustrations/gauge-mobile-line-123.svg',
  mobileTooltipPointer: '/assets/illustrations/gauge-mobile-tooltip-pointer.svg',
  glow: '/assets/illustrations/gauge-glow-ellipse-20.svg',
};

export const FI_CONTENT = {
  currentAge: 65,
  potentialAge: 38,
  deltaText: '27 years sooner !',
};

export const SCORE_BREAKDOWN: ScoreBreakdownMetric[] = [
  {
    id: 'savings',
    title: 'Savings',
    scoreText: '(19 / 20)',
    valueText: '₹3.4L / ₹4L',
    progress: 83,
    progressTone: 'success',
  },
  {
    id: 'liquidity',
    title: 'Liquidity',
    scoreText: '(14 / 20)',
    valueText: '₹8L / ₹4L',
    status: { label: 'Over allocation', tone: 'warning', icon: '/assets/icons/status-warning.svg' },
    progress: 100,
    progressTone: 'warning',
  },
  {
    id: 'emergency-funds',
    title: 'Emergency Funds',
    scoreText: '(0 / 20)',
    valueText: '₹0 / ₹4L',
    status: { label: 'Critical', tone: 'danger', icon: '/assets/icons/status-danger.svg' },
    progress: 6,
    progressTone: 'danger',
  },
  {
    id: 'life-insurance',
    title: 'Life Insurance',
    scoreText: '(5 / 20)',
    valueText: '₹50L / ₹2Cr',
    status: { label: 'Cover is too low', tone: 'danger', icon: '/assets/icons/status-danger.svg' },
    progress: 31,
    progressTone: 'danger',
  },
  {
    id: 'health-insurance',
    title: 'Health Insurance',
    scoreText: '(20 / 20)',
    valueText: '₹50L / ₹20L',
    status: { label: 'Target met', tone: 'success', icon: '/assets/icons/status-success.svg' },
    progress: 100,
    progressTone: 'success',
  },
  {
    id: 'investments',
    title: 'Investments',
    scoreText: '(20 / 20)',
    valueText: '₹13L / ₹10L',
    status: { label: 'Target met', tone: 'success', icon: '/assets/icons/status-success.svg' },
    progress: 100,
    progressTone: 'success',
  },
];

const sharedFunds = [
  {
    id: 'fund-1',
    name: 'HDFC Mid-Cap Fund',
    cagr: '26.6% (3Y)',
    icon: '/assets/funds/hdfc-fund-icon.png',
  },
  {
    id: 'fund-2',
    name: 'HDFC Mid-Cap Fund',
    cagr: '26.6% (3Y)',
    icon: '/assets/funds/hdfc-fund-icon.png',
  },
];

export const ROADMAP_ACTIONS: RoadmapAction[] = [
  {
    id: 'emergency',
    title: 'Build Emergency Fund',
    severity: 'Critical',
    severityTone: 'danger',
    description:
      'You should have an emergency fund of at least 4 lakhs invested in a low risk fund. Start with as little as ₹500.',
    primaryCta: 'Build Safety Net',
    points: '+20 pts',
    infoRow: 'Super-fast Onboarding: Invest in under 3 minutes',
    funds: sharedFunds,
  },
  {
    id: 'liquidity',
    title: 'Improve Liquidity',
    severity: 'Needs Attention',
    severityTone: 'warning',
    description:
      'You are keeping too much money in the bank. Aim to keep at most ₹70K in your bank account. That will boost your score in liquidity as well as Investments.',
    primaryCta: 'Begin Investing',
    points: '+6 pts',
    infoRow: 'Super-fast Onboarding: Invest in under 3 minutes',
    funds: sharedFunds,
  },
  {
    id: 'growth',
    title: 'Maximize Growth',
    severity: 'Needs Attention',
    severityTone: 'warning',
    description:
      'Invest regularly in diversified options like mutual funds or index funds. Stay consistent and align investments with your goals and risk level.',
    primaryCta: 'Analyse your Mutual Funds',
    infoRow: 'Check performance in under 30 seconds',
    funds: sharedFunds,
  },
];

export const ADVISOR_CONTENT = {
  text: 'Got questions? Talk to Medha, your Personal Advisor to customize your strategy.',
  avatar: '/assets/advisor/medha.png',
  whatsappIcon: '/assets/icons/whatsapp.png',
  calendarIcon: '/assets/icons/calendar.svg',
};
