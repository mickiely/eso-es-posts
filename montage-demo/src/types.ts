export type IndustryId = 'barber' | 'builder' | 'electrician' | 'cafe';

export type Urgency = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface EnquiryOption {
  id: string;
  label: string;
  need: string;
  urgency: Urgency;
  estValue: number;
  nextAction: string;
  smsReply: string;
  playbook: string[];
}

export interface FollowUpConfig {
  product: 'Frother' | 'Ripple';
  headline: string;
  message: string;
  explain: string;
}

export interface IndustryConfig {
  id: IndustryId;
  label: string;
  businessName: string;
  tagline: string;
  accent: string;
  address: string;
  reviewScore: number;
  reviewCount: number;
  services: string[];
  missedCallText: string;
  instantSmsIntro: string;
  enquiryOptions: EnquiryOption[];
  followUp: FollowUpConfig;
  avgJobValue: number;
}

export type StepId =
  | 'select'
  | 'discovery'
  | 'missedCall'
  | 'leadCapture'
  | 'playbook'
  | 'followUp'
  | 'results';

export const STEP_ORDER: StepId[] = [
  'select',
  'discovery',
  'missedCall',
  'leadCapture',
  'playbook',
  'followUp',
  'results',
];

export interface DemoState {
  step: StepId;
  industryId: IndustryId | null;
  selectedEnquiryId: string | null;
  customerReply: string;
  callMissed: boolean;
}
