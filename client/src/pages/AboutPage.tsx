import React from 'react';
import { ShieldCheck, HeartPulse, AlertTriangle, BookOpen, Stethoscope, CheckCircle2 } from 'lucide-react';
import { SafetyDisclaimerCard } from '../components/SafetyDisclaimerCard';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5 text-brand-600" />
          <span>About & Clinical Safety Framework</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
          About MediVoice AI
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          An accessible voice-first healthcare triage assistant engineered for rapid urgency classification.
        </p>
      </div>

      {/* Safety Notice Banner */}
      <SafetyDisclaimerCard />

      {/* Mission & Purpose */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-brand-600" />
          <span>Mission & Motivation</span>
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          In healthcare, seconds matter when critical symptoms arise. Many people struggle with whether a symptom is an emergency or whether it can wait for a clinic appointment. For the elderly, individuals with motor challenges, or non-native English speakers, typing complex medical descriptions can be frustrating or impossible.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          <strong>MediVoice AI</strong> was developed as a student hackathon project to demonstrate how conversational voice interfaces combined with <em>deterministic triage safety rules</em> can democratize access to preliminary healthcare guidance.
        </p>
      </div>

      {/* Architecture Philosophy: Deterministic Rules vs LLMs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Safety Architecture: Why Rules Always Win</span>
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Large language models (LLMs) can be unpredictable, hallucinate, or give false reassurance. In MediVoice AI, <strong>the language model is never allowed to independently decide an emergency classification</strong>.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900">Deterministic Safety Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rules for chest pain, respiratory arrest, stroke (FAST), and anaphylaxis execute through strict, unit-tested deterministic logic. Emergency signals immediately halt conversational loops.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900">AI Conversational Role</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The AI layer is restricted to speech-to-text clarification, asking targeted follow-ups regarding duration and severity, and organizing facts without hallucinating diagnoses.
            </p>
          </div>
        </div>
      </div>

      {/* Clinical Review Roadmap */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-brand-600" />
          <span>Roadmap for Real-World Clinical Validation</span>
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Because MediVoice AI is currently an <strong>unvalidated hackathon prototype</strong>, the following multi-stage clinical validation steps are required before any public clinical release:
        </p>
        <ol className="space-y-3 pt-2 text-xs sm:text-sm text-slate-700">
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-brand-200">
              1
            </span>
            <span><strong>Emergency Physician Peer Review:</strong> Formal panel review by certified emergency medicine specialists and general practitioners.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-brand-200">
              2
            </span>
            <span><strong>Standardized Triage Protocol Alignment:</strong> Benchmarking against recognized clinical scales (e.g., Manchester Triage System, Emergency Severity Index).</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-brand-200">
              3
            </span>
            <span><strong>Multilingual Medical Accuracy Audit:</strong> Verification by certified medical translators for Telugu, Hindi, and regional dialects.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-brand-200">
              4
            </span>
            <span><strong>Regulatory Compliance & Ethics Clearance:</strong> Medical Device Software (SaMD) regulatory evaluation and ethics board (IRB) review.</span>
          </li>
        </ol>
      </div>
    </div>
  );
};
