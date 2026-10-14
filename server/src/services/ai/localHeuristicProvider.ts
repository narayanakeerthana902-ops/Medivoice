import { ChatMessage, ChatResponse, ClinicalSummary } from './types.js';
import { triageEngine } from '../../triage/engine.js';

export class LocalHeuristicProvider {
  public async generateChatResponse(
    userMessage: string,
    history: ChatMessage[],
    language: 'en' | 'hi' | 'te' = 'en'
  ): Promise<ChatResponse> {
    const fullConversationText = [...history.map(m => m.content), userMessage].join(' ');
    
    // Safety First: Test full text against deterministic triage engine
    const triageCheck = triageEngine.evaluate({ symptoms: fullConversationText, language });

    if (triageCheck.urgency === 'emergency') {
      const emergencyReply = this.getEmergencyResponseText(language, triageCheck.reason);
      return {
        reply: emergencyReply,
        isEmergencyAlert: true,
        emergencyGuidance: {
          action: 'Seek emergency medical help immediately. Call 112 (India) or your local emergency line.',
          contact: '112'
        },
        collectedInformation: {
          reportedSymptoms: triageCheck.reportedSymptoms,
          missingDetails: []
        },
        providerUsed: 'deterministic-emergency-interceptor'
      };
    }

    // Determine what information has already been gathered
    const lowerConv = fullConversationText.toLowerCase();
    const hasDuration = lowerConv.includes('day') || lowerConv.includes('hour') || lowerConv.includes('week') || lowerConv.includes('morning') || lowerConv.includes('since') || lowerConv.includes('दिन') || lowerConv.includes('घंटे') || lowerConv.includes('రోజుల');
    const hasSeverity = lowerConv.includes('mild') || lowerConv.includes('moderate') || lowerConv.includes('severe') || lowerConv.includes('bad') || lowerConv.includes('intense') || lowerConv.includes('दर्द') || lowerConv.includes('నొప్పి');
    const hasAssociated = lowerConv.includes('also') || lowerConv.includes('fever') || lowerConv.includes('cough') || lowerConv.includes('nausea') || lowerConv.includes('vomit') || lowerConv.includes('బుఖార్') || lowerConv.includes('జ్వరం');

    let reply = '';
    let suggestedFollowUp = '';
    const missingDetails: string[] = [];

    if (!hasDuration) {
      missingDetails.push('Onset / Duration');
      if (language === 'hi') {
        reply = 'मैं समझ गया। क्या आप बता सकते हैं कि ये लक्षण कब शुरू हुए थे (जैसे आज सुबह, कुछ दिनों से)?';
      } else if (language === 'te') {
        reply = 'నేను అర్థం చేసుకున్నాను. ఈ లక్షణాలు ఎప్పుడు ప్రారంభమయ్యాయి (ఉదాహరణకు ఈ ఉదయం, కొన్ని రోజులుగా)?';
      } else {
        reply = 'Thank you for sharing. Could you tell me approximately when these symptoms started (e.g., this morning, 2 days ago)?';
      }
      suggestedFollowUp = 'When did these symptoms first start?';
    } else if (!hasSeverity) {
      missingDetails.push('Severity / Intensity');
      if (language === 'hi') {
        reply = 'आप इस दर्द या तकलीफ की तीव्रता को कैसे बताएंगे - हल्का, मध्यम, या बहुत तेज?';
      } else if (language === 'te') {
        reply = 'మీరు ఈ లక్షణం యొక్క తీవ్రతను ఎలా వివరిస్తారు - తేలికపాటి, మధ్యస్థ, లేదా చాలా తీవ్రమైనదా?';
      } else {
        reply = 'How would you describe the severity of this symptom right now—is it mild, moderate, or quite severe?';
      }
      suggestedFollowUp = 'How severe is the discomfort?';
    } else if (!hasAssociated) {
      missingDetails.push('Associated Symptoms');
      if (language === 'hi') {
        reply = 'क्या आपको इसके अलावा कोई और लक्षण महसूस हो रहे हैं, जैसे बुखार, चक्कर या मतली?';
      } else if (language === 'te') {
        reply = 'మీకు దీనితో పాటు జ్వరం, తలతిరుగుడు లేదా వికారం వంటి ఇతర లక్షణాలు ఉన్నాయా?';
      } else {
        reply = 'Are you experiencing any other accompanying symptoms, such as fever, dizziness, or nausea?';
      }
      suggestedFollowUp = 'Are there any other symptoms accompanying this?';
    } else {
      if (language === 'hi') {
        reply = 'जानकारी के लिए धन्यवाद। मैंने आपके लक्षणों का विवरण संकलित कर लिया है। कृपया अपनी प्रारंभिक स्थिति और मार्गदर्शन देखने के लिए परिणाम की समीक्षा करें।';
      } else if (language === 'te') {
        reply = 'సమాచారాన్ని పంచుకున్నందుకు ధన్యవాదాలు. మీ లక్షణాల వివరాలు నమోదు చేయబడ్డాయి. దయచేసి ప్రాథమిక ఫలితాలను సమీక్షించండి.';
      } else {
        reply = 'Thank you. I have gathered the key details about your symptoms. Based on this information, you can now view your preliminary urgency guidance and summary.';
      }
    }

    return {
      reply,
      isEmergencyAlert: false,
      suggestedFollowUp,
      collectedInformation: {
        reportedSymptoms: triageCheck.reportedSymptoms,
        missingDetails
      },
      providerUsed: 'local-clinical-heuristic'
    };
  }

  public generateSummary(data: {
    reportedSymptoms: string[];
    rawDescription: string;
    duration?: string;
    severity?: string;
    ageRange?: string;
    urgency: string;
    recommendedActions: string[];
  }): ClinicalSummary {
    const unknownDetails: string[] = [];

    if (!data.duration) unknownDetails.push('Exact symptom duration / onset time');
    if (!data.severity) unknownDetails.push('Subjective severity rating scale');
    if (!data.ageRange) unknownDetails.push('Patient age group');
    unknownDetails.push('Current vital signs (blood pressure, oxygen saturation, temperature, pulse)');
    unknownDetails.push('Past medical history & current prescription medications');

    const formattedText = [
      '==================================================',
      'MEDIVOICE AI - PRELIMINARY CLINICAL HEALTH SUMMARY',
      '==================================================',
      'NOTE: This is a patient-reported symptom summary prepared for discussion with a qualified healthcare professional.',
      'It does not contain doctor examination findings, lab tests, or confirmed medical diagnoses.',
      '',
      `Reported Symptoms: ${data.reportedSymptoms.length > 0 ? data.reportedSymptoms.join(', ') : data.rawDescription}`,
      `Reported Onset / Duration: ${data.duration || 'Not specified by user'}`,
      `Reported Severity: ${data.severity || 'Not specified by user'}`,
      `Reported Age Bracket: ${data.ageRange || 'Not provided'}`,
      `Preliminary Urgency Classification: ${data.urgency.toUpperCase()}`,
      '',
      'Recommended Next Steps:',
      ...data.recommendedActions.map((action, i) => `  ${i + 1}. ${action}`),
      '',
      'Unassessed / Unknown Clinical Information:',
      ...unknownDetails.map(u => `  - ${u}`),
      '',
      'Safety Disclaimer: If symptoms worsen suddenly or emergency warning signs develop, call emergency services (112) immediately.',
      '=================================================='
    ].join('\n');

    return {
      patientReportedSymptoms: data.reportedSymptoms.length > 0 ? data.reportedSymptoms : [data.rawDescription],
      reportedOnset: data.duration || 'Not provided',
      reportedSeverity: data.severity || 'Not provided',
      associatedSymptoms: data.reportedSymptoms.slice(1),
      urgencyClassification: data.urgency,
      recommendedNextSteps: data.recommendedActions,
      unknownInformation: unknownDetails,
      clinicalDisclaimer: 'Preliminary AI guidance only. Not a medical diagnosis. Based on unvalidated prototype triage rules.',
      formattedPlainText: formattedText
    };
  }

  private getEmergencyResponseText(language: 'en' | 'hi' | 'te', reason: string): string {
    if (language === 'hi') {
      return `⚠️ तत्काल आपातकालीन चेतावनी: आपके द्वारा बताए गए लक्षण (${reason}) गंभीर हो सकते हैं। कृपया तुरंत आपातकालीन नंबर 112 पर कॉल करें या निकटतम आपातकालीन अस्पताल जाएं। अकेले गाड़ी न चलाएं।`;
    }
    if (language === 'te') {
      return `⚠️ అత్యవసర హెచ్చరిక: మీరు తెలిపిన లక్షణాలు (${reason}) అత్యవసరమైనవి కావచ్చు. దయచేసి వెంటనే 112 కి కాల్ చేయండి లేదా సమీప అత్యవసర విభాగానికి వెళ్లండి. ఒంటరిగా డ్రైవ్ చేయవద్దు.`;
    }
    return `⚠️ IMMEDIATE EMERGENCY ALERT: Based on what you described (${reason}), you may be experiencing a medical emergency. Call 112 (or your local emergency services) immediately or go to the nearest emergency room. Do not attempt to drive yourself.`;
  }
}

export const localHeuristicProvider = new LocalHeuristicProvider();
