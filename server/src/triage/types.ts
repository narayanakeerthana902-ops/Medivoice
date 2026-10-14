export type UrgencyLevel = 'emergency' | 'urgent' | 'routine' | 'insufficient_information';

export interface TriageInput {
  symptoms: string;
  duration?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  ageRange?: 'child' | 'teen' | 'adult' | 'senior';
  additionalInfo?: string;
  language?: 'en' | 'hi' | 'te';
}

export interface WarningSign {
  id: string;
  title: string;
  description: string;
  criticality: 'emergency' | 'urgent';
}

export interface SafetyRule {
  id: string;
  name: string;
  urgency: UrgencyLevel;
  keywords: string[];
  patterns?: RegExp[];
  contraindications?: string[];
  description: string;
  warningSigns: WarningSign[];
  recommendedActions: string[];
  escalationAdvice: string;
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
