import { z } from 'zod';

export const TriageRequestSchema = z.object({
  symptoms: z.string().min(1, 'Symptom description cannot be empty').max(3000, 'Description too long'),
  duration: z.string().max(100).optional(),
  severity: z.enum(['mild', 'moderate', 'severe']).optional(),
  ageRange: z.enum(['child', 'teen', 'adult', 'senior']).optional(),
  additionalInfo: z.string().max(2000).optional(),
  language: z.enum(['en', 'hi', 'te']).optional().default('en')
});

export type TriageRequestBody = z.infer<typeof TriageRequestSchema>;

export const ChatRequestSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(2000),
  conversationHistory: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string().max(4000)
    })
  ).default([]),
  context: z.object({
    symptoms: z.string().optional(),
    duration: z.string().optional(),
    severity: z.string().optional(),
    ageRange: z.string().optional()
  }).optional(),
  language: z.enum(['en', 'hi', 'te']).optional().default('en')
});

export type ChatRequestBody = z.infer<typeof ChatRequestSchema>;

export const SummaryRequestSchema = z.object({
  reportedSymptoms: z.array(z.string()).default([]),
  rawDescription: z.string().min(1, 'Raw description required').max(5000),
  duration: z.string().optional(),
  severity: z.string().optional(),
  ageRange: z.string().optional(),
  urgency: z.enum(['emergency', 'urgent', 'routine', 'insufficient_information']),
  recommendedActions: z.array(z.string()).default([])
});

export type SummaryRequestBody = z.infer<typeof SummaryRequestSchema>;
