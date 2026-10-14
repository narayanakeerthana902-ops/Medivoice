import { TriageInput, TriageResult, SafetyRule, WarningSign, UrgencyLevel } from './types.js';
import { EMERGENCY_RULES, URGENT_RULES, ROUTINE_RULES, RULESET_VERSION } from './rules.js';

export class TriageEngine {
  private emergencyRules: SafetyRule[] = EMERGENCY_RULES;
  private urgentRules: SafetyRule[] = URGENT_RULES;
  private routineRules: SafetyRule[] = ROUTINE_RULES;

  /**
   * Evaluates reported symptoms using strictly deterministic safety rules.
   * Emergency rules are checked first. Routine classifications cannot override higher priorities.
   */
  public evaluate(input: TriageInput): TriageResult {
    const rawText = `${input.symptoms || ''} ${input.additionalInfo || ''}`.trim();
    const normalizedText = rawText.toLowerCase();

    // Check for insufficient information
    if (!rawText || rawText.length < 5 || this.isMeaninglessInput(normalizedText)) {
      return {
        urgency: 'insufficient_information',
        reason: 'The symptom description provided contains insufficient clinical detail to perform an initial safety classification.',
        reportedSymptoms: rawText ? [rawText] : [],
        warningSigns: [],
        followUpQuestions: [
          'What specific symptom are you feeling right now (e.g., headache, fever, cough, chest discomfort)?',
          'When did this symptom start, and has it gotten steadily worse?',
          'Are you experiencing any shortness of breath, dizziness, or intense pain?'
        ],
        recommendedActions: [
          'Please describe your symptoms in more detail, including what you feel and how long it has been going on.',
          'If you feel very unwell or suspect an emergency, do not wait—contact local emergency services (112) immediately.'
        ],
        limitations: [
          'This is preliminary, automated triage guidance and does not replace evaluation by a qualified medical professional.',
          'Insufficient data was provided to safely rule out serious medical conditions.'
        ],
        emergencyContact: {
          primary: '112',
          description: 'Emergency Services (India) / Dial local emergency number if outside India',
          ambulance: '102'
        },
        rulesetVersion: RULESET_VERSION,
        isClinicallyValidated: false,
        evaluatedAt: new Date().toISOString()
      };
    }

    const matchedEmergencyRules: SafetyRule[] = [];
    const matchedUrgentRules: SafetyRule[] = [];
    const matchedRoutineRules: SafetyRule[] = [];
    const identifiedWarningSigns: WarningSign[] = [];

    // Step 1: Evaluate Emergency Rules
    for (const rule of this.emergencyRules) {
      if (this.matchesRule(rule, normalizedText)) {
        matchedEmergencyRules.push(rule);
        identifiedWarningSigns.push(...rule.warningSigns);
      }
    }

    // Step 2: Evaluate Urgent Rules
    for (const rule of this.urgentRules) {
      if (this.matchesRule(rule, normalizedText)) {
        matchedUrgentRules.push(rule);
        identifiedWarningSigns.push(...rule.warningSigns);
      }
    }

    // High severity override or vulnerable age check
    const isSevereInput = input.severity === 'severe';
    const isVulnerableAge = input.ageRange === 'child' || input.ageRange === 'senior';

    // Step 3: Evaluate Routine Rules ONLY if no emergency or urgent warning signs
    for (const rule of this.routineRules) {
      if (this.matchesRule(rule, normalizedText)) {
        // Contraindication check
        const hasContraindication = rule.contraindications?.some(ci => normalizedText.includes(ci.toLowerCase()));
        if (!hasContraindication && !isSevereInput) {
          matchedRoutineRules.push(rule);
        }
      }
    }

    // Determine Final Urgency Category based on precedence
    let finalUrgency: UrgencyLevel = 'insufficient_information';
    let primaryRule: SafetyRule | null = null;
    let reason = '';
    const recommendedActions: string[] = [];

    if (matchedEmergencyRules.length > 0) {
      finalUrgency = 'emergency';
      primaryRule = matchedEmergencyRules[0];
      reason = `Critical emergency warning signs detected: ${matchedEmergencyRules.map(r => r.name).join('; ')}. Immediate professional intervention is required.`;
      
      // Combine all recommended actions from emergency rules
      for (const rule of matchedEmergencyRules) {
        for (const action of rule.recommendedActions) {
          if (!recommendedActions.includes(action)) {
            recommendedActions.push(action);
          }
        }
      }
    } else if (matchedUrgentRules.length > 0 || (isSevereInput && (normalizedText.includes('pain') || normalizedText.includes('fever') || normalizedText.includes('head')))) {
      finalUrgency = 'urgent';
      if (matchedUrgentRules.length > 0) {
        primaryRule = matchedUrgentRules[0];
        reason = `Symptoms match urgent clinical criteria (${matchedUrgentRules.map(r => r.name).join('; ')}) requiring timely professional medical assessment within 12 to 24 hours.`;
        for (const rule of matchedUrgentRules) {
          for (const action of rule.recommendedActions) {
            if (!recommendedActions.includes(action)) {
              recommendedActions.push(action);
            }
          }
        }
      } else {
        reason = 'Severe symptom intensity reported. Even without clear emergency red flags, severe symptoms warrant prompt evaluation by a clinician today.';
        recommendedActions.push('Seek consultation with a physician or visit an urgent care center promptly today.');
        recommendedActions.push('Have someone accompany you if you feel weak or disoriented.');
        recommendedActions.push('If breathing difficulties, chest pain, or fainting occur, dial 112 immediately.');
      }

      if (isVulnerableAge && !reason.includes('age')) {
        reason += ` Note: Reported age group (${input.ageRange}) requires extra clinical caution for acute symptoms.`;
      }
    } else if (matchedRoutineRules.length > 0) {
      finalUrgency = 'routine';
      primaryRule = matchedRoutineRules[0];
      reason = `Reported symptoms appear consistent with mild or non-emergency conditions (${matchedRoutineRules.map(r => r.name).join('; ')}). No emergency warning signs were identified.`;
      for (const rule of matchedRoutineRules) {
        for (const action of rule.recommendedActions) {
          if (!recommendedActions.includes(action)) {
            recommendedActions.push(action);
          }
        }
      }
    } else {
      // Symptoms described but didn't match known high-confidence criteria
      finalUrgency = 'insufficient_information';
      reason = 'Your description does not match explicit red-flag criteria, but lacks sufficient clinical specifics to safely determine that routine home care is appropriate.';
      recommendedActions.push('Monitor your symptoms closely and consult a healthcare professional if they persist or cause concern.');
      recommendedActions.push('Seek immediate medical attention if you experience severe pain, breathing trouble, or sudden confusion.');
    }

    // Extract reported symptoms summary
    const reportedSymptoms = this.extractSymptomList(rawText, input);

    // Follow up questions based on urgency
    const followUpQuestions: string[] = [];
    if (finalUrgency === 'emergency') {
      followUpQuestions.push('Are you currently alone, or is someone with you who can assist emergency responders?');
      followUpQuestions.push('Have you called 112 or local emergency services yet?');
    } else if (finalUrgency === 'urgent') {
      followUpQuestions.push('Has the symptom been steadily worsening over the last several hours?');
      followUpQuestions.push('Are you able to keep liquids down and stay hydrated?');
      followUpQuestions.push('Do you have any existing chronic medical conditions (like asthma, diabetes, or heart disease)?');
    } else {
      followUpQuestions.push('Have you noticed any new symptoms developing since this first began?');
      followUpQuestions.push('Does anything specific make the symptom feel better or worse?');
    }

    return {
      urgency: finalUrgency,
      reason,
      reportedSymptoms,
      warningSigns: identifiedWarningSigns,
      followUpQuestions,
      recommendedActions,
      limitations: [
        'MediVoice AI provides preliminary automated triage guidance only and is not a diagnostic device or doctor replacement.',
        'This assessment is based on an unvalidated prototype ruleset and reported subjective symptoms.',
        'If your symptoms worsen or you feel suddenly very ill, always seek professional medical or emergency care immediately.'
      ],
      emergencyContact: {
        primary: '112',
        description: 'National Emergency Number (India) / Dial local emergency number if abroad',
        ambulance: '102'
      },
      rulesetVersion: RULESET_VERSION,
      isClinicallyValidated: false,
      evaluatedAt: new Date().toISOString()
    };
  }

  private matchesRule(rule: SafetyRule, text: string): boolean {
    // Check keywords
    const matchedKeyword = rule.keywords.some(kw => text.includes(kw.toLowerCase()));
    if (matchedKeyword) return true;

    // Check regex patterns
    if (rule.patterns) {
      for (const pattern of rule.patterns) {
        if (pattern.test(text)) return true;
      }
    }

    return false;
  }

  private isMeaninglessInput(text: string): boolean {
    const stopwords = ['hi', 'hello', 'hey', 'test', 'help', 'ok', 'okay', 'yes', 'no', 'feeling sick', 'sick'];
    const cleaned = text.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    return stopwords.includes(cleaned);
  }

  private extractSymptomList(rawText: string, input: TriageInput): string[] {
    const symptoms: string[] = [];
    const candidates = [
      'headache', 'fever', 'cough', 'abdominal pain', 'stomach pain', 'chest pain',
      'dizziness', 'breathing difficulty', 'shortness of breath', 'weakness', 'vomiting',
      'nausea', 'sore throat', 'back pain', 'rash', 'fatigue', 'chills'
    ];

    const lower = rawText.toLowerCase();
    for (const c of candidates) {
      if (lower.includes(c)) {
        symptoms.push(c.charAt(0).toUpperCase() + c.slice(1));
      }
    }

    if (symptoms.length === 0 && rawText.length > 0) {
      symptoms.push(rawText.slice(0, 100));
    }

    if (input.duration) {
      symptoms.push(`Duration: ${input.duration}`);
    }
    if (input.severity) {
      symptoms.push(`Severity: ${input.severity}`);
    }

    return symptoms;
  }
}

export const triageEngine = new TriageEngine();
