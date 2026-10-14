import { ChatMessage, ChatResponse, ClinicalSummary } from './types.js';
import { localHeuristicProvider } from './localHeuristicProvider.js';
import { triageEngine } from '../../triage/engine.js';

export interface AIServiceAdapter {
  generateChat(userMessage: string, history: ChatMessage[], language?: 'en' | 'hi' | 'te'): Promise<ChatResponse>;
  generateSummary(data: any): Promise<ClinicalSummary>;
}

export class ConfigurableAIAdapter implements AIServiceAdapter {
  private provider: string;
  private apiKey?: string;
  private model: string;

  constructor() {
    this.provider = (process.env.AI_PROVIDER || 'local').toLowerCase();
    this.apiKey = process.env.AI_API_KEY || '';
    this.model = process.env.AI_MODEL || 'gemini-1.5-flash';
  }

  public async generateChat(
    userMessage: string,
    history: ChatMessage[],
    language: 'en' | 'hi' | 'te' = 'en'
  ): Promise<ChatResponse> {
    // CRITICAL SAFETY RULE: Always test the message against deterministic triage rules FIRST!
    // Never allow an LLM to override or delay an emergency warning.
    const emergencyCheck = triageEngine.evaluate({ symptoms: userMessage, language });
    if (emergencyCheck.urgency === 'emergency') {
      return localHeuristicProvider.generateChatResponse(userMessage, history, language);
    }

    // If external provider is configured and has an API key
    if ((this.provider === 'gemini' || this.provider === 'openai') && this.apiKey) {
      try {
        if (this.provider === 'gemini') {
          return await this.callGeminiAPI(userMessage, history, language);
        } else {
          return await this.callOpenAIAPI(userMessage, history, language);
        }
      } catch (err: any) {
        console.warn(`[MediVoice AI] AI Provider (${this.provider}) error or quota limit: ${err?.message || 'unknown'}. Gracefully falling back to local heuristic provider.`);
        return localHeuristicProvider.generateChatResponse(userMessage, history, language);
      }
    }

    // Default: Robust local clinical heuristic provider
    return localHeuristicProvider.generateChatResponse(userMessage, history, language);
  }

  public async generateSummary(data: any): Promise<ClinicalSummary> {
    // Pure factual summarizer that never hallucinates facts
    return localHeuristicProvider.generateSummary(data);
  }

  private async callGeminiAPI(userMessage: string, history: ChatMessage[], language: string): Promise<ChatResponse> {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    
    const systemPrompt = `You are MediVoice AI, a calm, professional healthcare triage assistant.
CRITICAL SAFETY INSTRUCTIONS:
- You are NOT a doctor. You do not provide definitive diagnoses or prescribe medication dosages.
- Ask ONE concise, clinically relevant follow-up question at a time if details (such as onset time, severity, or associated symptoms) are missing.
- Keep language simple, clear, and reassuring. Avoid medical jargon.
- If the user reports emergency symptoms (severe chest pain, severe breathing difficulty, stroke signs, heavy bleeding), tell them to dial 112 immediately.
- Respond in ${language === 'hi' ? 'Hindi' : language === 'te' ? 'Telugu' : 'English'}.`;

    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      ...history.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      })),
      { role: 'user', parts: [{ text: userMessage }] }
    ];

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 300
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const json = await response.json() as any;
    const textReply = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!textReply) {
      throw new Error('Empty response from Gemini API');
    }

    // Safety re-check of AI generated text
    const aiSafetyCheck = triageEngine.evaluate({ symptoms: textReply });
    const isEmergency = aiSafetyCheck.urgency === 'emergency';

    return {
      reply: textReply,
      isEmergencyAlert: isEmergency,
      suggestedFollowUp: textReply,
      collectedInformation: {
        reportedSymptoms: [userMessage],
        missingDetails: []
      },
      providerUsed: `gemini-${this.model}`
    };
  }

  private async callOpenAIAPI(userMessage: string, history: ChatMessage[], language: string): Promise<ChatResponse> {
    const endpoint = 'https://api.openai.com/v1/chat/completions';
    
    const messages = [
      {
        role: 'system',
        content: `You are MediVoice AI, a calm, professional healthcare triage assistant.
Never give definitive diagnoses or prescribe medication dosages.
Ask at most one focused follow-up question. Never hallucinate facts.
Respond in ${language === 'hi' ? 'Hindi' : language === 'te' ? 'Telugu' : 'English'}.`
      },
      ...history.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: userMessage }
    ];

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model || 'gpt-4o-mini',
        messages,
        temperature: 0.2,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API returned status ${response.status}`);
    }

    const json = await response.json() as any;
    const textReply = json?.choices?.[0]?.message?.content || '';

    return {
      reply: textReply,
      isEmergencyAlert: false,
      suggestedFollowUp: textReply,
      collectedInformation: {
        reportedSymptoms: [userMessage],
        missingDetails: []
      },
      providerUsed: 'openai'
    };
  }
}

export const aiAdapter = new ConfigurableAIAdapter();
