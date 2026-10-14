import { TriageInput, TriageResult, ChatMessage, ClinicalSummary } from '../types/triage';

const API_BASE = '/api';

export class ApiError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export const evaluateTriage = async (input: TriageInput): Promise<TriageResult> => {
  const response = await fetch(`${API_BASE}/triage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || errorData.error || 'Failed to evaluate symptoms.',
      response.status,
      errorData.details
    );
  }

  return response.json();
};

export const sendChatMessage = async (
  message: string,
  history: ChatMessage[],
  language: string = 'en'
): Promise<{
  reply: string;
  isEmergencyAlert: boolean;
  emergencyGuidance?: { action: string; contact: string };
  suggestedFollowUp?: string;
  collectedInformation?: any;
}> => {
  const response = await fetch(`${API_BASE}/assistant/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      conversationHistory: history.map(h => ({ role: h.role, content: h.content })),
      language
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || 'Assistant response failed.',
      response.status
    );
  }

  return response.json();
};

export const generateHealthSummary = async (data: {
  reportedSymptoms: string[];
  rawDescription: string;
  duration?: string;
  severity?: string;
  ageRange?: string;
  urgency: string;
  recommendedActions: string[];
}): Promise<ClinicalSummary> => {
  const response = await fetch(`${API_BASE}/assistant/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new ApiError('Failed to generate health summary.', response.status);
  }

  return response.json();
};

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return response.ok;
  } catch {
    return false;
  }
};
