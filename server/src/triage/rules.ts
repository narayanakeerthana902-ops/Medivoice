import { SafetyRule } from './types.js';

export const RULESET_VERSION = 'prototype-1.0.0';

export const EMERGENCY_RULES: SafetyRule[] = [
  {
    id: 'EMERGENCY_CARDIAC',
    name: 'Acute Coronary / Severe Cardiac Warning Signs',
    urgency: 'emergency',
    keywords: [
      'chest pain', 'chest pressure', 'chest tightness', 'heart attack',
      'radiating pain to jaw', 'pain radiating to left arm', 'squeezing chest',
      'छाती में दर्द', 'सीने में दर्द', 'हार्ट अटैक', 'గుండె నొప్పి', 'ఛాతీ నొప్పి'
    ],
    patterns: [
      /chest\s*(?:pain|pressure|tightness|heaviness|discomfort|crushing)/i,
      /(?:pain|pressure)\s*(?:radiating|spreading)\s*to\s*(?:arm|jaw|back|neck)/i,
      /(?:heart\s*attack|myocardial\s*infarction)/i
    ],
    description: 'Potential acute coronary syndrome or critical cardiopulmonary compromise.',
    warningSigns: [
      {
        id: 'WS_CARDIAC',
        title: 'Cardiac Warning Signs',
        description: 'Persistent or severe chest discomfort, pressure, or radiating pain requires immediate emergency evaluation.',
        criticality: 'emergency'
      }
    ],
    recommendedActions: [
      'Call emergency services immediately (dial 112 in India, or your local emergency number).',
      'Do not drive yourself to the emergency department; request an ambulance.',
      'Sit down, rest in a comfortable position, and stay calm while waiting for emergency responders.',
      'If you take prescribed emergency medication (such as nitroglycerin), follow your doctor’s prior instructions.'
    ],
    escalationAdvice: 'Any chest pain combined with shortness of breath, cold sweat, or lightheadedness is an emergency.'
  },
  {
    id: 'EMERGENCY_RESPIRATORY',
    name: 'Severe Respiratory Distress / Airway Compromise',
    urgency: 'emergency',
    keywords: [
      'cannot breathe', 'difficulty breathing', 'gasping for air', 'shortness of breath',
      'struggling to breathe', 'blue lips', 'choking', 'suffocating',
      'सांस लेने में तकलीफ', 'दम घुट रहा है', 'ఊపిరి ఆడటం లేదు', 'శ్వాస తీసుకోవడంలో ఇబ్బంది'
    ],
    patterns: [
      /(?:cannot|can't|unable\s*to)\s*breathe/i,
      /severe\s*(?:shortness\s*of\s*breath|breathing\s*difficulty|dyspnea)/i,
      /(?:gasping|struggling)\s*for\s*(?:air|breath)/i,
      /(?:blue|cyanotic)\s*(?:lips|fingers|face)/i
    ],
    description: 'Acute severe respiratory failure, airway obstruction, or critical oxygen desaturation.',
    warningSigns: [
      {
        id: 'WS_RESPIRATORY',
        title: 'Severe Respiratory Distress',
        description: 'Inability to breathe comfortably, gasping, or cyanosis (bluish tint) is a life-threatening sign.',
        criticality: 'emergency'
      }
    ],
    recommendedActions: [
      'Dial 112 or local emergency services immediately.',
      'Sit upright to assist airway clearance and ease work of breathing.',
      'Loosen any tight clothing around your neck or chest.',
      'Do not lie flat.'
    ],
    escalationAdvice: 'Inability to speak in full sentences or bluish discoloration around lips requires instant medical response.'
  },
  {
    id: 'EMERGENCY_NEURO_STROKE',
    name: 'Acute Neurological Compromise / Stroke Symptoms (FAST)',
    urgency: 'emergency',
    keywords: [
      'stroke', 'facial drooping', 'face drooping', 'arm weakness', 'one-sided weakness',
      'slurred speech', 'sudden numbness', 'cannot speak', 'sudden vision loss',
      'लकवा', 'चेहरे का लटकना', 'బోల్తా పడటం', 'మాట పడిపోవడం'
    ],
    patterns: [
      /(?:facial|face)\s*(?:droop|drooping|asymmetry)/i,
      /(?:one[-\s]*sided|arm|leg)\s*(?:weakness|paralysis|numbness)/i,
      /(?:slurred|garbled|unable\s*to)\s*speech/i,
      /sudden\s*(?:loss\s*of\s*vision|blindness|confusion)/i,
      /\bstroke\b/i
    ],
    description: 'Suspected acute ischemic or hemorrhagic stroke requiring time-critical thrombolytic or neurointerventional care.',
    warningSigns: [
      {
        id: 'WS_STROKE',
        title: 'Acute Stroke Symptoms (FAST)',
        description: 'Sudden facial droop, one-sided weakness, or speech impairment indicates possible stroke where minutes count.',
        criticality: 'emergency'
      }
    ],
    recommendedActions: [
      'Call emergency services immediately (112). Note the exact time symptoms first started.',
      'Do not give aspirin, food, or drink until evaluated by medical professionals.',
      'Keep the person resting comfortably in a safe position.',
      'If the person is drowsy, place them on their side in the recovery position.'
    ],
    escalationAdvice: 'Stroke treatment outcomes depend heavily on rapid arrival at a stroke-ready medical center.'
  },
  {
    id: 'EMERGENCY_UNCONSCIOUSNESS',
    name: 'Altered Consciousness / Unresponsiveness / Severe Head Injury',
    urgency: 'emergency',
    keywords: [
      'unconscious', 'passed out', 'fainted and not waking', 'unresponsive', 'cannot wake up',
      'collapsed', 'coma', 'loss of consciousness', 'blackout with head injury',
      'बेहोश', 'होश खोना', 'స్పృహ తప్పడం'
    ],
    patterns: [
      /(?:unconscious|unresponsive|comatose)/i,
      /(?:loss\s*of\s*consciousness|passed\s*out|collapsed)\s*(?:and|not|unable)/i,
      /(?:cannot|can't)\s*(?:wake|awaken)/i
    ],
    description: 'Severe depression of central nervous system, coma, or intracranial trauma.',
    warningSigns: [
      {
        id: 'WS_UNCONSCIOUS',
        title: 'Loss of Consciousness / Unresponsiveness',
        description: 'Failure to awaken or prolonged unresponsiveness is a critical emergency.',
        criticality: 'emergency'
      }
    ],
    recommendedActions: [
      'Call 112 immediately.',
      'Check breathing and pulse. If not breathing, trained personnel should initiate CPR.',
      'Place in recovery position on their side if breathing normally, keeping airway open.',
      'Do not shake or move forcefully if spinal injury is suspected.'
    ],
    escalationAdvice: 'Any loss of consciousness with head trauma or inability to stay awake requires urgent emergency evaluation.'
  },
  {
    id: 'EMERGENCY_ANAPHYLAXIS',
    name: 'Severe Allergic Reaction / Anaphylaxis',
    urgency: 'emergency',
    keywords: [
      'anaphylaxis', 'severe allergic reaction', 'throat closing', 'swollen tongue',
      'swollen throat', 'cannot swallow', 'allergy breathing', 'epipen',
      'एलर्जी सांस', 'गला बंद होना'
    ],
    patterns: [
      /(?:severe\s*allergic|anaphylaxis|anaphylactic)/i,
      /(?:throat|tongue|lip)\s*(?:swelling|swollen|closing)/i,
      /(?:cannot|difficulty)\s*swallow(?:ing)?\s*and\s*breathe/i
    ],
    description: 'Systemic Type I hypersensitivity reaction with upper/lower airway compromise or vascular collapse.',
    warningSigns: [
      {
        id: 'WS_ANAPHYLAXIS',
        title: 'Anaphylaxis Warning Signs',
        description: 'Rapid onset of airway swelling, hives, or breathing distress after an allergen exposure is life-threatening.',
        criticality: 'emergency'
      }
    ],
    recommendedActions: [
      'Administer epinephrine auto-injector (EpiPen) immediately into the outer mid-thigh if available.',
      'Call 112 / emergency services at once.',
      'Lie flat with legs elevated unless breathing is difficult (in which case sit upright).',
      'Do not stand or walk abruptly.'
    ],
    escalationAdvice: 'Anaphylaxis can progress in minutes; do not delay calling emergency help.'
  },
  {
    id: 'EMERGENCY_SEVERE_BLEEDING',
    name: 'Severe Uncontrolled Bleeding / Hemorrhage',
    urgency: 'emergency',
    keywords: [
      'severe bleeding', 'uncontrolled bleeding', 'spurting blood', 'blood won\'t stop',
      'vomiting blood', 'coughing blood', 'heavy blood loss',
      'खून बहना बंद नहीं हो रहा', 'రక్తం ఆగడం లేదు'
    ],
    patterns: [
      /(?:spurting|uncontrolled|severe|heavy)\s*(?:bleeding|blood)/i,
      /(?:vomit|cough)(?:ing)?\s*(?:large\s*amounts\s*of\s*)?blood/i,
      /blood\s*(?:gushing|pouring|pulsing)/i
    ],
    description: 'Arterial or severe venous hemorrhage leading to hypovolemic shock.',
    warningSigns: [
      {
        id: 'WS_BLEEDING',
        title: 'Severe Uncontrolled Hemorrhage',
        description: 'Bleeding that does not stop after direct pressure or arterial spurting requires instant trauma response.',
        criticality: 'emergency'
      }
    ],
    recommendedActions: [
      'Apply firm, continuous direct pressure to the wound with a clean cloth or bandage.',
      'Call 112 immediately.',
      'Elevate the injured limb if possible and no fracture is suspected.',
      'Do not remove blood-soaked cloths; add more layers on top and maintain pressure.'
    ],
    escalationAdvice: 'Dizziness, pale skin, or confusion alongside bleeding indicates impending shock.'
  },
  {
    id: 'EMERGENCY_SEIZURE',
    name: 'Active, Prolonged, or Multiple Seizures',
    urgency: 'emergency',
    keywords: [
      'active seizure', 'continuous seizure', 'prolonged seizure', 'convulsions not stopping',
      'status epilepticus', 'multiple seizures', 'दौरा पड़ना', 'మూర్ఛ'
    ],
    patterns: [
      /(?:active|continuous|ongoing|prolonged)\s*seizure/i,
      /seizure\s*(?:longer\s*than\s*5\s*minutes|not\s*stopping)/i,
      /(?:repeated|multiple)\s*seizures\s*without\s*waking/i
    ],
    description: 'Prolonged seizure activity exceeding 5 minutes or serial seizures without recovery.',
    warningSigns: [
      {
        id: 'WS_SEIZURE',
        title: 'Prolonged or Repeated Seizures',
        description: 'Seizures lasting more than 5 minutes or recurring in succession require emergency intervention.',
        criticality: 'emergency'
      }
    ],
    recommendedActions: [
      'Call 112 emergency services immediately.',
      'Clear the area of hard or sharp objects to prevent injury.',
      'Do NOT place anything in the person’s mouth.',
      'Gently turn them on their side once shaking stops to keep airway clear.'
    ],
    escalationAdvice: 'A first-time seizure or any seizure lasting over 5 minutes is an emergency.'
  }
];

export const URGENT_RULES: SafetyRule[] = [
  {
    id: 'URGENT_HIGH_FEVER',
    name: 'Persistent High Fever or Fever with Warning Signs',
    urgency: 'urgent',
    keywords: [
      'high fever', 'fever 103', 'fever 104', 'persistent fever', 'fever for 4 days',
      'fever with chills', 'fever with vomiting', 'तेज बुखार', 'తీవ్ర జ్వరం'
    ],
    patterns: [
      /fever\s*(?:above\s*10[2-5]|over\s*39|for\s*(?:3|4|5|[0-9]+)\s*days|persistent|worsening)/i,
      /high\s*fever\s*with\s*(?:stiff\s*neck|shivering|rash|confusion)/i
    ],
    description: 'High or persistent pyrexia with potential bacterial or systemic infection.',
    warningSigns: [
      {
        id: 'WS_HIGH_FEVER',
        title: 'Concerning High Fever',
        description: 'A temperature exceeding 39°C (102°F) or persisting for multiple days warrants prompt medical evaluation.',
        criticality: 'urgent'
      }
    ],
    recommendedActions: [
      'Seek evaluation by a healthcare professional today (urgent care clinic or outpatient doctor).',
      'Stay hydrated with oral rehydration solutions or water in small, frequent sips.',
      'Rest in a cool, well-ventilated room.',
      'If stiff neck, light sensitivity, or purple rash develops, escalate to emergency immediately.'
    ],
    escalationAdvice: 'Seek emergency care if fever is accompanied by stiff neck, confusion, or difficulty breathing.'
  },
  {
    id: 'URGENT_ABDOMINAL_PAIN',
    name: 'Acute Significant Abdominal Pain',
    urgency: 'urgent',
    keywords: [
      'severe stomach pain', 'acute abdominal pain', 'right lower side pain', 'appendicitis pain',
      'stomach cramps cannot stand', 'पेट में बहुत तेज दर्द', 'కడుపులో తీవ్రమైన నొప్పి'
    ],
    patterns: [
      /(?:severe|acute|sharp|intense)\s*(?:abdominal|stomach|belly)\s*pain/i,
      /(?:right\s*lower\s*quadrant|right\s*side\s*stomach)\s*pain/i,
      /stomach\s*pain\s*with\s*(?:vomiting|fever)/i
    ],
    description: 'Potential surgical abdomen, appendicitis, cholecystitis, or bowel obstruction.',
    warningSigns: [
      {
        id: 'WS_ACUTE_ABDOMEN',
        title: 'Significant Abdominal Pain',
        description: 'Severe abdominal pain, especially localized or accompanied by vomiting and fever, requires prompt clinical exam.',
        criticality: 'urgent'
      }
    ],
    recommendedActions: [
      'Have this examined by a doctor or urgent care center promptly today.',
      'Do not eat heavy meals or take strong unprescribed painkillers before examination.',
      'Avoid placing heat pads on the abdomen if appendicitis is suspected.',
      'Escalate to emergency if pain becomes unbearable, abdomen feels rigid/hard, or you vomit blood.'
    ],
    escalationAdvice: 'Rigid belly, inability to pass stool with vomiting, or fainting with abdominal pain is an emergency.'
  },
  {
    id: 'URGENT_DEHYDRATION_VOMITING',
    name: 'Persistent Vomiting or Dehydration Risk',
    urgency: 'urgent',
    keywords: [
      'cannot keep water down', 'vomiting for 24 hours', 'severe diarrhea and vomiting',
      'extreme thirst and dark urine', 'no urination for 12 hours', 'dehydration'
    ],
    patterns: [
      /(?:cannot|unable\s*to)\s*keep\s*(?:fluids|water|food)\s*down/i,
      /vomiting\s*(?:for\s*(?:more\s*than\s*)?(?:24|48)\s*hours|all\s*day|continuously)/i,
      /(?:severe\s*dehydration|dry\s*mouth\s*and\s*no\s*urine)/i
    ],
    description: 'Risk of hypovolemia, electrolyte imbalance, or acute renal strain.',
    warningSigns: [
      {
        id: 'WS_DEHYDRATION',
        title: 'Dehydration & Persistent Vomiting',
        description: 'Inability to retain liquids for over 24 hours can lead to rapid electrolyte and kidney complications.',
        criticality: 'urgent'
      }
    ],
    recommendedActions: [
      'Contact a doctor or visit an urgent care center today for rehydration assessment.',
      'Take tiny sips (1 teaspoon every 5 minutes) of oral rehydration solution.',
      'Avoid pure plain water in large quantities or sugary sodas.'
    ],
    escalationAdvice: 'Confusion, sunken eyes, or complete absence of urination for over 12 hours warrants urgent emergency clinic care.'
  },
  {
    id: 'URGENT_WOUND_INFECTION',
    name: 'Deep Laceration, Suspected Fracture, or Spreading Infection',
    urgency: 'urgent',
    keywords: [
      'deep cut', 'needs stitches', 'cut won\'t close', 'suspected fracture', 'cannot walk on foot',
      'red streaks from wound', 'infected wound', 'pus and fever'
    ],
    patterns: [
      /deep\s*(?:cut|gash|wound|laceration)/i,
      /(?:needs\s*stitches|wound\s*gaping)/i,
      /(?:suspected\s*broken|cannot\s*bear\s*weight|deformed\s*limb)/i,
      /red\s*streaks\s*(?:spreading|from\s*wound)/i
    ],
    description: 'Traumatic lacerations needing closure within golden period (6-12 hours) or spreading soft tissue infection.',
    warningSigns: [
      {
        id: 'WS_WOUND_FRACTURE',
        title: 'Deep Injury or Spreading Infection',
        description: 'Lacerations require timely suturing within 12 hours; spreading redness indicates cellulitis/lymphangitis.',
        criticality: 'urgent'
      }
    ],
    recommendedActions: [
      'Visit an urgent care center or clinic within a few hours.',
      'Clean surface with mild running water and cover with sterile dressing.',
      'Immobilize injured limb; do not bear weight if fracture is suspected.',
      'Ensure tetanus vaccination status is reviewed by the clinician.'
    ],
    escalationAdvice: 'Open bone fractures or loss of sensation/pulse in the extremity require emergency care.'
  }
];

export const ROUTINE_RULES: SafetyRule[] = [
  {
    id: 'ROUTINE_MILD_URI',
    name: 'Mild Upper Respiratory Symptoms / Common Cold',
    urgency: 'routine',
    keywords: [
      'mild cold', 'runny nose', 'sneezing', 'mild cough', 'slight sore throat',
      'stuffy nose', 'nasal congestion', 'हल्की सर्दी', 'జలుబు'
    ],
    patterns: [
      /(?:mild|slight)\s*(?:cold|cough|sore\s*throat|congestion)/i,
      /runny\s*nose\s*and\s*sneezing/i,
      /minor\s*congestion/i
    ],
    contraindications: [
      'difficulty breathing', 'shortness of breath', 'chest pain', 'high fever', 'blue lips'
    ],
    description: 'Presumed uncomplicated viral upper respiratory infection without warning signs.',
    warningSigns: [],
    recommendedActions: [
      'Schedule a routine primary care visit if symptoms do not improve within 7-10 days.',
      'Get ample rest and maintain adequate hydration with warm fluids.',
      'Use saline nasal sprays or warm steam inhalation for congestion relief.',
      'Monitor symptoms carefully for any worsening.'
    ],
    escalationAdvice: 'If you develop difficulty breathing, high persistent fever, or chest pain, seek prompt medical care immediately.'
  },
  {
    id: 'ROUTINE_MILD_ACHE',
    name: 'Mild Musculoskeletal Ache or Minor Tension Headache',
    urgency: 'routine',
    keywords: [
      'mild headache', 'muscle soreness', 'slight backache', 'stiff neck after sleeping',
      'tired muscles', 'mild strain'
    ],
    patterns: [
      /(?:mild|minor|slight)\s*(?:headache|backache|muscle\s*soreness|body\s*ache)/i,
      /sore\s*muscles\s*after\s*(?:workout|gym|exercise)/i
    ],
    contraindications: [
      'worst headache of life', 'thunderclap', 'sudden weakness', 'numbness', 'stiff neck with fever'
    ],
    description: 'Common mild tension-type headache or benign postural/exercise soreness.',
    warningSigns: [],
    recommendedActions: [
      'Rest, gentle stretching, and ensure adequate sleep and hydration.',
      'Consult your general physician during normal clinic hours if persistent.',
      'Keep a symptom log to track any potential triggers.'
    ],
    escalationAdvice: 'Sudden severe "thunderclap" headache, vision changes, or fever with stiff neck requires emergency care.'
  }
];
