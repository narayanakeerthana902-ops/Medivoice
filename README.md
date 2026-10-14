# MediVoice AI

> **"Speak Your Symptoms. Understand Your Urgency."**
> An accessible, voice-first AI healthcare triage web application designed for rapid preliminary urgency guidance, built for a student hackathon demonstration.

---

## 🌟 Overview & Key Objectives

**MediVoice AI** allows users to describe their symptoms either by typing or by speaking naturally through an interactive voice assistant in **English, Hindi (हिंदी), and Telugu (తెలుగు)**. 

The application evaluates reported symptoms against conservative, transparent clinical triage safety rules to provide a preliminary urgency classification:
- **EMERGENCY**: Severe life-threatening warning signs (e.g., acute chest pain, severe breathing failure, stroke symptoms, loss of consciousness, uncontrolled bleeding). Triggers instant emergency protocols and direct dialing to **112 (National Emergency Number, India)**.
- **URGENT**: Symptoms requiring prompt clinical assessment within 12–24 hours (e.g., high persistent fever, acute abdominal pain, dehydration, deep wounds).
- **ROUTINE**: Mild or non-urgent self-limiting symptoms with safety-net advice on what changes require escalation.
- **INSUFFICIENT INFORMATION**: When reported details are too vague or sparse to make a safe determination.

### 🛡️ Safety-First Architecture: Deterministic Rules Precedence
Unlike generic AI chatbots that guess medical conditions, MediVoice AI implements a **deterministic triage safety engine**. 
- Emergency warning signs **always take precedence** over routine classifications.
- The language model **cannot independently override deterministic safety rules**.
- If external AI services fail or have no credentials configured, the system **continues to function 100% reliably** through its built-in clinical heuristic engine.

---

## 🚀 Key Features

1. **Voice-First Input**:
   - Hands-free microphone button with live listening waveform ripple animations.
   - Real-time speech-to-text with interim and final transcript preview.
   - **Editable Transcript**: Users can review, edit, and correct speech recognition mistakes before submitting.
   - Speech synthesis audio read-aloud toggle for accessibility.
   - Graceful fallback when browser voice recognition is unsupported.

2. **Multilingual Support**:
   - Supports **English**, **Hindi (हिंदी)**, and **Telugu (తెలుగు)** across the UI, speech recognition (`en-US`, `hi-IN`, `te-IN`), and speech output.

3. **Deterministic Triage Safety Engine (`prototype-1.0.0`)**:
   - Strict pattern matching and clinical keyword analysis based on authoritative emergency triage guidance.
   - Conservative escalation for vulnerable age groups (children & seniors 65+).
   - High urgency takes precedence if multiple rules match. Missing info never defaults to routine.

4. **Conversational AI Assistant**:
   - Calming, professional healthcare dialogue.
   - Targeted follow-up questions (onset time, progression, severity, accompanying symptoms).
   - Instant emergency interception if red-flag symptoms are spoken during conversation.

5. **Doctor-Ready Health Summary**:
   - Generates a concise, strictly factual summary of patient-reported symptoms.
   - Never hallucinates diagnoses, vital signs, or missing facts.
   - One-click **Copy Summary** and **Download Plain Text (`.txt`)** options.

6. **Privacy by Design**:
   - **Zero mandatory login or account creation**.
   - No advertising trackers or commercial cookies.
   - In-memory temporary sessions only; zero permanent storage of health data.
   - Zero audio file retention (browser-side speech recognition).
   - One-click **Discard Current Session** button on the Privacy page.

---

## 🛠️ Technology Stack

### Frontend:
- **React 18** with **TypeScript**
- **Vite** for rapid bundling and hot module replacement
- **Tailwind CSS** for healthcare UI design system
- **Lucide React** for icons
- **React Router v6** for client-side navigation
- **Web Speech API** (`SpeechRecognition` and `SpeechSynthesis`)

### Backend:
- **Node.js** & **Express** with **TypeScript** (`tsx`)
- **Zod** for schema validation
- **Helmet** for secure HTTP headers & CORS protection
- **Vitest** & **Supertest** for automated unit and integration tests

---

## 📦 Project Directory Structure

```text
medivoice-ai/
├── client/                     # Vite + React + TypeScript Frontend
│   ├── src/
│   │   ├── __tests__/          # Frontend component tests
│   │   ├── components/         # Header, Footer, MicrophoneButton, EmergencyAlertBanner, SafetyCard
│   │   ├── context/            # LanguageContext (EN/HI/TE), TriageContext (in-memory state)
│   │   ├── hooks/              # useSpeechRecognition, useSpeechSynthesis
│   │   ├── pages/              # LandingPage, SymptomChecker, VoiceAssistant, Results, About, Privacy
│   │   ├── services/           # api.ts (backend client communication)
│   │   ├── types/              # triage.ts
│   │   ├── App.tsx             # Main router
│   │   └── main.tsx            # Entry point
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
│
├── server/                     # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── controllers/        # triageController, chatController, summaryController
│   │   ├── routes/             # api.ts (health, triage, chat, summarize)
│   │   ├── schemas/            # apiSchemas.ts (Zod validation)
│   │   ├── services/
│   │   │   └── ai/             # Configurable AI Adapter, Local Heuristic Provider
│   │   ├── triage/             # Deterministic Triage Engine & Ruleset (prototype-1.0.0)
│   │   └── index.ts            # Express server entrypoint
│   ├── tests/                  # Automated safety rule & API tests
│   ├── .env.example
│   ├── tsconfig.json
│   └── package.json
│
├── .env.example                # Root environment template
├── .gitignore
├── package.json                # Root convenience scripts
└── README.md                   # Full documentation
```

---

## ⚡ Quickstart & Installation

### Prerequisites
- Node.js version 18 or higher (tested on Node v24)
- npm version 9 or higher

### Step 1: Clone and Install Dependencies
From the project root directory, run:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Step 2: Environment Configuration
Create a `.env` file in the `server/` directory (you can copy `.env.example`):
```bash
cd ../server
cp .env.example .env
```
Default configuration (`server/.env`):
```env
PORT=3001
CLIENT_ORIGIN=http://localhost:5173
AI_PROVIDER=local
AI_API_KEY=
AI_MODEL=gemini-1.5-flash
NODE_ENV=development
```

### Step 3: Start the Backend Server
```bash
cd server
npm run dev
```
The server will start on `http://localhost:3001`. You can test health status at:
`http://localhost:3001/api/health`

### Step 4: Start the Frontend Application
In a separate terminal window:
```bash
cd client
npm run dev
```
Open `http://localhost:5173` in any modern browser (Chrome, Edge, or Safari recommended for Web Speech API support).

---

## 🧪 Running Automated Tests

MediVoice AI comes with comprehensive automated tests validating the core safety triage rules and API endpoints:

### Backend Tests:
Tests deterministic safety rules, emergency warning sign detection, precedence rules, missing data handling, and API input validation:
```bash
cd server
npm test
```

### Frontend Tests:
Tests interactive components, editable speech transcript, text fallback, and emergency banners:
```bash
cd client
npm test
```

---

## 🔌 Feature Matrix: Credential Requirements

| Feature | Works Without API Key? | Notes |
| :--- | :---: | :--- |
| **Deterministic Emergency Triage Rules** | ✅ **YES** | 100% deterministic rules engine on the backend. |
| **Voice Speech Recognition** | ✅ **YES** | Utilizes browser Web Speech API. |
| **Spoken Healthcare Guidance (TTS)** | ✅ **YES** | Utilizes browser SpeechSynthesis API. |
| **Multilingual UI (EN, HI, TE)** | ✅ **YES** | Built-in clinical translation dictionary. |
| **Conversational Follow-up Questions** | ✅ **YES** | Local clinical heuristic provider analyzes missing clinical facts. |
| **Doctor Health Summary Export** | ✅ **YES** | Factual formatting generator without hallucinations. |
| **Emergency 112 Direct Dialing** | ✅ **YES** | Direct tel:112 integration and emergency instructions. |
| **External LLM Dialogue Enrichment** | 🔑 *Optional* | If `AI_PROVIDER=gemini` or `openai` with `AI_API_KEY`, provides LLM natural language flexibility with strict safety fallbacks. |

---

## ⚠️ Known Limitations & Clinical Disclaimer

> [!WARNING]
> **UNVALIDATED PROTOTYPE NOTICE:**
> MediVoice AI is an experimental hackathon project and software prototype. **It is NOT a certified medical device, does not provide definitive medical diagnoses, and cannot replace a licensed physician or emergency services.**

### Roadmap Before Any Public Clinical Deployment:
1. **Clinical Peer Review**: Full formal review by emergency medicine physicians and certified triage nurses.
2. **Clinical Validation Studies**: Prospective observational study benchmarking accuracy against standard triage scales (e.g. Manchester Triage System).
3. **Medical Translation Certification**: Certified clinical translation review for Hindi, Telugu, and other regional dialects.
4. **Software as a Medical Device (SaMD) Compliance**: Formal regulatory audit under applicable health data and medical software frameworks.
