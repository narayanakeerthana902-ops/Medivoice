import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode } from '../types/triage';

interface TranslationMap {
  appName: string;
  tagline: string;
  home: string;
  symptomChecker: string;
  voiceAssistant: string;
  about: string;
  privacy: string;
  startChecking: string;
  heroHeadline: string;
  heroDesc: string;
  checkSymptomsCTA: string;
  talkToAICTA: string;
  voiceFirstTitle: string;
  voiceFirstDesc: string;
  aiAssistantTitle: string;
  aiAssistantDesc: string;
  urgencyTitle: string;
  urgencyDesc: string;
  summaryTitle: string;
  summaryDesc: string;
  step1: string;
  step1Desc: string;
  step2: string;
  step2Desc: string;
  step3: string;
  step3Desc: string;
  safetyDisclaimer: string;
  emergencyCallBtn: string;
  emergencyDialTitle: string;
  emergencyTitle: string;
  urgentTitle: string;
  routineTitle: string;
  insufficientTitle: string;
  readAloud: string;
  copySummary: string;
  downloadText: string;
  startNewAssessment: string;
  listening: string;
  tapToSpeak: string;
  tapToStop: string;
  speechUnavailable: string;
}

const translations: Record<LanguageCode, TranslationMap> = {
  en: {
    appName: 'MediVoice AI',
    tagline: 'Speak Your Symptoms. Understand Your Urgency.',
    home: 'Home',
    symptomChecker: 'Symptom Checker',
    voiceAssistant: 'Voice Assistant',
    about: 'About & Safety',
    privacy: 'Privacy',
    startChecking: 'Start Checking',
    heroHeadline: 'Your Symptoms. Your Voice. Clearer Next Steps.',
    heroDesc: 'Describe how you feel by typing or speaking naturally. MediVoice AI helps you understand whether your symptoms may require emergency care, prompt medical attention, or a routine consultation.',
    checkSymptomsCTA: 'Check My Symptoms',
    talkToAICTA: 'Talk to Voice Assistant',
    voiceFirstTitle: 'Voice-First Healthcare',
    voiceFirstDesc: 'Explain your symptoms naturally using your voice without tedious typing.',
    aiAssistantTitle: 'AI Symptom Assistant',
    aiAssistantDesc: 'Answer simple follow-up questions to organize your health information.',
    urgencyTitle: 'Preliminary Urgency Guidance',
    urgencyDesc: 'Understand the potential urgency of your symptoms through clinical triage rules.',
    summaryTitle: 'Easy-to-Share Health Summary',
    summaryDesc: 'Prepare a concise, factual summary to discuss with a healthcare professional.',
    step1: 'STEP 1: Describe your symptoms',
    step1Desc: 'Speak or type how you feel in your own words.',
    step2: 'STEP 2: Answer follow-up questions',
    step2Desc: 'Clarify duration, severity, and associated warning signs.',
    step3: 'STEP 3: Receive preliminary guidance',
    step3Desc: 'Get clear urgency classification and recommended next steps.',
    safetyDisclaimer: 'MediVoice AI provides preliminary guidance only. It cannot diagnose medical conditions or guarantee that a symptom is safe. If you think you are experiencing a medical emergency, seek emergency assistance immediately.',
    emergencyCallBtn: 'Emergency: Call 112',
    emergencyDialTitle: 'Immediate Emergency Dial 112',
    emergencyTitle: 'Seek Emergency Medical Help Now',
    urgentTitle: 'Prompt Medical Assessment Recommended',
    routineTitle: 'Routine Consultation May Be Appropriate',
    insufficientTitle: 'More Information Needed for Safe Guidance',
    readAloud: 'Read Guidance Aloud',
    copySummary: 'Copy Health Summary',
    downloadText: 'Download Plain Text',
    startNewAssessment: 'Start New Assessment',
    listening: 'Listening... Speak now',
    tapToSpeak: 'Tap microphone to speak symptoms',
    tapToStop: 'Tap to stop recording',
    speechUnavailable: 'Voice recognition is not supported in this browser. Please use the text input below.'
  },
  hi: {
    appName: 'मेडीवॉयस एआई (MediVoice AI)',
    tagline: 'अपने लक्षण बोलें। अपनी स्थिति की तात्कालिकता समझें।',
    home: 'होम',
    symptomChecker: 'लक्षण जांचें',
    voiceAssistant: 'वॉयस असिस्टेंट',
    about: 'सुरक्षा एवं परिचय',
    privacy: 'गोपनीयता',
    startChecking: 'शुरू करें',
    heroHeadline: 'आपके लक्षण। आपकी आवाज़। स्पष्ट अगला कदम।',
    heroDesc: 'टाइप करके या स्वाभाविक रूप से बोलकर बताएं कि आप कैसा महसूस कर रहे हैं। मेडीवॉयस एआई आपको यह समझने में मदद करता है कि क्या आपके लक्षणों के लिए आपातकालीन देखभाल, तत्काल डॉक्टर की सलाह या सामान्य परामर्श की आवश्यकता है।',
    checkSymptomsCTA: 'अपने लक्षण जांचें',
    talkToAICTA: 'वॉयस असिस्टेंट से बात करें',
    voiceFirstTitle: 'आवाज़-आधारित स्वास्थ्य सहायता',
    voiceFirstDesc: 'टाइप किए बिना अपनी आवाज़ में स्वाभाविक रूप से अपने लक्षण बताएं।',
    aiAssistantTitle: 'एआई लक्षण सहायक',
    aiAssistantDesc: 'अपनी स्वास्थ्य जानकारी को व्यवस्थित करने के लिए सरल प्रश्नों के उत्तर दें।',
    urgencyTitle: 'प्रारंभिक तात्कालिकता मार्गदर्शन',
    urgencyDesc: 'समीक्षित नियमों के आधार पर अपने लक्षणों की तात्कालिकता को समझें।',
    summaryTitle: 'डॉक्टर के लिए सारांश',
    summaryDesc: 'डॉक्टर के साथ चर्चा करने के लिए एक संक्षिप्त, तथ्यात्मक सारांश तैयार करें।',
    step1: 'चरण 1: अपने लक्षण बताएं',
    step1Desc: 'बोलकर या लिखकर बताएं कि आप कैसा महसूस कर रहे हैं।',
    step2: 'चरण 2: प्रश्नों के उत्तर दें',
    step2Desc: 'लक्षणों की अवधि और तीव्रता स्पष्ट करें।',
    step3: 'चरण 3: प्रारंभिक मार्गदर्शन प्राप्त करें',
    step3Desc: 'तात्कालिकता श्रेणी और अगले कदम जानें।',
    safetyDisclaimer: 'मेडीवॉयस एआई केवल प्रारंभिक मार्गदर्शन प्रदान करता है। यह किसी चिकित्सीय स्थिति का निदान नहीं कर सकता। यदि आपको लगता है कि आप आपात स्थिति का सामना कर रहे हैं, तो तुरंत आपातकालीन सहायता लें।',
    emergencyCallBtn: 'आपातकालीन: 112 डायल करें',
    emergencyDialTitle: 'तत्काल आपातकाल: 112 डायल करें',
    emergencyTitle: 'तुरंत आपातकालीन चिकित्सा सहायता प्राप्त करें',
    urgentTitle: 'शीघ्र चिकित्सा मूल्यांकन की सिफारिश',
    routineTitle: 'नियमित परामर्श उपयुक्त हो सकता है',
    insufficientTitle: 'सुरक्षित मार्गदर्शन के लिए अधिक जानकारी चाहिए',
    readAloud: 'मार्गदर्शन सुनें',
    copySummary: 'सारांश कॉपी करें',
    downloadText: 'टेक्स्ट डाउनलोड करें',
    startNewAssessment: 'नया मूल्यांकन शुरू करें',
    listening: 'सुन रहा हूँ... कृपया बोलें',
    tapToSpeak: 'बोलने के लिए माइक दबाएं',
    tapToStop: 'रोकने के लिए दबाएं',
    speechUnavailable: 'इस ब्राउज़र में आवाज़ पहचान उपलब्ध नहीं है। कृपया लिखकर बताएं।'
  },
  te: {
    appName: 'మెడివాయిస్ AI (MediVoice AI)',
    tagline: 'మీ లక్షణాలను మాట్లాడండి. అత్యవసరతను అర్థం చేసుకోండి.',
    home: 'హోమ్',
    symptomChecker: 'లక్షణాల తనిఖీ',
    voiceAssistant: 'వాయిస్ అసిస్టెంట్',
    about: 'భద్రత & వివరాలు',
    privacy: 'గోప్యత',
    startChecking: 'ప్రారంభించండి',
    heroHeadline: 'మీ లక్షణాలు. మీ స్వరం. స్పష్టమైన తదుపరి అడుగు.',
    heroDesc: 'టైప్ చేయడం ద్వారా లేదా సహజంగా మాట్లాడటం ద్వారా మీరు ఎలా భావిస్తున్నారో వివరించండి. మీ లక్షణాలకు అత్యవసర చికిత్స లేదా సాధారణ సంప్రదింపులు అవసరమా అని తెలుసుకోవడానికి మెడివాయిస్ AI మీకు సహాయపడుతుంది.',
    checkSymptomsCTA: 'నా లక్షణాలను తనిఖీ చేయండి',
    talkToAICTA: 'వాయిస్ అసిస్టెంట్‌తో మాట్లాడండి',
    voiceFirstTitle: 'వాయిస్-ఫస్ట్ హెల్త్‌కేర్',
    voiceFirstDesc: 'టైప్ చేయకుండా మీ స్వరం ద్వారా సులభంగా లక్షణాలను వివరించండి.',
    aiAssistantTitle: 'AI లక్షణ సహాయకుడు',
    aiAssistantDesc: 'మీ ఆరోగ్య సమాచారాన్ని సమగ్రపరచడానికి సులభమైన ప్రశ్నలకు సమాధానం ఇవ్వండి.',
    urgencyTitle: 'ప్రాథమిక అత్యవసర మార్గదర్శకత్వం',
    urgencyDesc: 'మీ లక్షణాల సంభావ్య అత్యవసర స్థాయిని అర్థం చేసుకోండి.',
    summaryTitle: 'వైద్యుని కోసం ఆరోగ్య సారాంశం',
    summaryDesc: 'వైద్యునితో చర్చించడానికి సంక్షిప్త, వాస్తవిక సారాంశాన్ని సిద్ధం చేయండి.',
    step1: 'దశ 1: మీ లక్షణాలను వివరించండి',
    step1Desc: 'మీరు ఎలా భావిస్తున్నారో మాట్లాడండి లేదా టైప్ చేయండి.',
    step2: 'దశ 2: అనుబంధ ప్రశ్నలకు సమాధానం ఇవ్వండి',
    step2Desc: 'వ్యవధి మరియు తీవ్రత వివరాలను అందించండి.',
    step3: 'దశ 3: ప్రాథమిక మార్గదర్శకత్వం పొందండి',
    step3Desc: 'అత్యవసర వర్గీకరణ మరియు తదుపరి చర్యలను తెలుసుకోండి.',
    safetyDisclaimer: 'మెడివాయిస్ AI ప్రాథమిక మార్గదర్శకత్వాన్ని మాత్రమే అందిస్తుంది. ఇది వైద్య నిర్ధారణ చేయదు. మీకు అత్యవసర పరిస్థితి అనిపిస్తే, వెంటనే అత్యవసర సహాయాన్ని పొందండి.',
    emergencyCallBtn: 'అత్యవసరం: 112 కి కాల్ చేయండి',
    emergencyDialTitle: 'తక్షణ అత్యవసరం 112 కి కాల్ చేయండి',
    emergencyTitle: 'వెంటనే అత్యవసర వైద్య సహాయం పొందండి',
    urgentTitle: 'త్వరిత వైద్య పరీక్ష సిఫార్సు చేయబడింది',
    routineTitle: 'సాధారణ సంప్రదింపులు సరిపోవచ్చు',
    insufficientTitle: 'మరింత స్పష్టమైన సమాచారం అవసరం',
    readAloud: 'మార్గదర్శకత్వాన్ని వినండి',
    copySummary: 'సారాంశాన్ని కాపీ చేయండి',
    downloadText: 'టెక్స్ట్‌ను డౌన్‌లోడ్ చేయండి',
    startNewAssessment: 'కొత్త తనిఖీని ప్రారంభించండి',
    listening: 'వింటున్నాను... ఇప్పుడు మాట్లాడండి',
    tapToSpeak: 'మాట్లాడటానికి మైక్ నొక్కండి',
    tapToStop: 'ఆపడానికి నొక్కండి',
    speechUnavailable: 'ఈ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ అందుబాటులో లేదు. దయచేసి టైప్ చేయండి.'
  }
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationMap;
  speechLangCode: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>('en');

  const speechLangCode = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-US';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language], speechLangCode }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
