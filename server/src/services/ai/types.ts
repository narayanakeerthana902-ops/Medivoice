export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  reply: string;
  isEmergencyAlert: boolean;
  emergencyGuidance?: {
    action: string;
    contact: string;
  };
  suggestedFollowUp?: string;
  collectedInformation: {
    reportedSymptoms: string[];
    duration?: string;
    severity?: string;
    missingDetails: string[];
  };
  providerUsed: string;
}

export interface ClinicalSummary {
  patientReportedSymptoms: string[];
  reportedOnset: string;
  reportedSeverity: string;
  associatedSymptoms: string[];
  urgencyClassification: string;
  recommendedNextSteps: string[];
  unknownInformation: string[];
  clinicalDisclaimer: string;
  formattedPlainText: string;
}
