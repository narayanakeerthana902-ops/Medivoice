export type UrgencyLevel = 'emergency' | 'urgent' | 'routine' | 'insufficient_information';

export type LanguageCode = 'en' | 'hi' | 'te';

export interface WarningSign {
  id: string;
  title: string;
  description: string;
  criticality: 'emergency' | 'urgent';
}

export interface TriageInput {
  symptoms: string;
  duration?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  ageRange?: 'child' | 'teen' | 'adult' | 'senior';
  additionalInfo?: string;
  language?: LanguageCode;
}

export interface TriageResult {
  urgency: UrgencyLevel;
  reason: string;
  reportedSymptoms: string[];
  warningSigns: WarningSign[];
  followUpQuestions: string[];
  recommendedActions: string[];
  limitations: string[];
  emergencyContact: {
    primary: string;
    description: string;
    ambulance: string;
  };
  rulesetVersion: string;
  isClinicallyValidated: boolean;
  evaluatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isEmergency?: boolean;
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
