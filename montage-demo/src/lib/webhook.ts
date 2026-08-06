import type { LeadSummary, LiveResult, Urgency } from '../types';

export interface MissedCallPayload {
  industryId: string;
  businessName: string;
  enquiryId: string;
  enquiryLabel: string;
  customerReply: string;
}

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;
const REQUEST_TIMEOUT_MS = 8000;

const URGENCIES: Urgency[] = ['Low', 'Medium', 'High', 'Urgent'];

function isUrgency(value: unknown): value is Urgency {
  return typeof value === 'string' && URGENCIES.includes(value as Urgency);
}

function normalizeLeadSummary(raw: unknown): LeadSummary {
  const obj = (raw ?? {}) as Record<string, unknown>;
  return {
    customer: typeof obj.customer === 'string' ? obj.customer : 'Fictional caller',
    need: typeof obj.need === 'string' ? obj.need : 'Not specified',
    urgency: isUrgency(obj.urgency) ? obj.urgency : 'Medium',
    estValue: typeof obj.estValue === 'number' ? obj.estValue : 0,
    nextAction: typeof obj.nextAction === 'string' ? obj.nextAction : 'Follow up with the customer',
  };
}

function normalizeResponse(raw: unknown): LiveResult {
  const obj = (raw ?? {}) as Record<string, unknown>;
  return {
    gotchaReply: typeof obj.gotchaReply === 'string' ? obj.gotchaReply : '',
    leadSummary: normalizeLeadSummary(obj.leadSummary),
    wsupChecklist: Array.isArray(obj.wsupChecklist)
      ? obj.wsupChecklist.filter((item): item is string => typeof item === 'string')
      : [],
    followUpAction: typeof obj.followUpAction === 'string' ? obj.followUpAction : '',
  };
}

export function isWebhookConfigured(): boolean {
  return Boolean(WEBHOOK_URL);
}

export async function sendMissedCallEnquiry(payload: MissedCallPayload): Promise<LiveResult> {
  if (!WEBHOOK_URL) {
    throw new Error('Live webhook is not configured (VITE_N8N_WEBHOOK_URL is unset).');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Webhook responded with status ${response.status}`);
    }

    const data = await response.json();
    return normalizeResponse(data);
  } finally {
    clearTimeout(timeoutId);
  }
}
