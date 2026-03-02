export type ScoreBreakdownMetric = {
  id: string;
  title: string;
  scoreText: string;
  valueText: string;
  status?: {
    label: string;
    tone: 'danger' | 'warning' | 'success';
    icon: string;
  };
  progress: number;
  progressTone: 'danger' | 'warning' | 'success';
};

export type RecommendedFund = {
  id: string;
  name: string;
  cagr: string;
  icon: string;
};

export type RoadmapAction = {
  id: string;
  title: string;
  severity: string;
  severityTone: 'danger' | 'warning';
  description: string;
  primaryCta: string;
  points?: string;
  infoRow: string;
  funds: RecommendedFund[];
};

export type ScoreGaugeCardProps = {
  score: number;
  peerText: string;
  tooltipText: string;
};

export type FinancialIndependenceCardProps = {
  currentAge: number;
  potentialAge: number;
  deltaText: string;
};

export type ScoreBreakdownItemProps = {
  metric: ScoreBreakdownMetric;
};

export type RoadmapCardProps = {
  action: RoadmapAction;
};

export type AdvisorCtaProps = {
  className?: string;
  compact?: boolean;
};
