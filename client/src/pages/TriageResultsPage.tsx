import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  PhoneCall,
  Volume2,
  VolumeX,
  Copy,
  Download,
  RotateCcw,
  Check,
  ShieldCheck,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useTriage } from '../context/TriageContext';
import { useLanguage } from '../context/LanguageContext';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { generateHealthSummary } from '../services/api';
import { EmergencyAlertBanner } from '../components/EmergencyAlertBanner';

export const TriageResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { result, input, resetSession, summary, setSummary } = useTriage();
  const { t, speechLangCode } = useLanguage();
  const { speak, stop, isSpeaking } = useSpeechSynthesis();

  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // If no result is present in session, redirect to symptom checker
  useEffect(() => {
    if (!result) {
      navigate('/checker');
      return;
    }

    // Auto-fetch clean clinical summary if not yet fetched
    if (!summary) {
      generateHealthSummary({
        reportedSymptoms: result.reportedSymptoms,
        rawDescription: input.symptoms || result.reason,
        duration: input.duration,
        severity: input.severity,
        ageRange: input.ageRange,
        urgency: result.urgency,
        recommendedActions: result.recommendedActions
      })
        .then(res => setSummary(res))
        .catch(err => console.warn('Summary generation issue:', err));
    }
  }, [result, navigate, input, summary, setSummary]);

  if (!result) {
    return null;
  }

  const handleReadGuidance = () => {
    if (isSpeaking) {
      stop();
    } else {
      const guidanceScript = `Urgency classification: ${result.urgency}. ${result.reason}. Recommended actions: ${result.recommendedActions.join('. ')}.`;
      speak(guidanceScript, speechLangCode);
    }
  };

  const handleCopySummary = async () => {
    const textToCopy = summary?.formattedPlainText || `${result.urgency.toUpperCase()} - ${result.reason}\n\nSymptoms: ${result.reportedSymptoms.join(', ')}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert('Unable to copy to clipboard.');
    }
  };

  const handleDownloadSummary = () => {
    const textToDownload = summary?.formattedPlainText || `${result.urgency.toUpperCase()} - ${result.reason}\n\nSymptoms: ${result.reportedSymptoms.join(', ')}`;
    const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `medivoice_health_summary_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleStartNew = () => {
    stop();
    resetSession();
    navigate('/checker');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Status and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Evaluation Result • Ruleset {result.rulesetVersion}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
            Preliminary Urgency Assessment
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Read guidance aloud button */}
          <button
            onClick={handleReadGuidance}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 text-red-600" /> : <Volume2 className="w-4 h-4 text-brand-600" />}
            <span>{isSpeaking ? 'Stop Audio' : t.readAloud}</span>
          </button>

          {/* Start New Assessment */}
          <button
            onClick={handleStartNew}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.startNewAssessment}</span>
          </button>
        </div>
      </div>

      {/* EMERGENCY CLASSIFICATION CARD */}
      {result.urgency === 'emergency' && (
        <EmergencyAlertBanner
          reason={result.reason}
          recommendedActions={result.recommendedActions}
          primaryContact={result.emergencyContact.primary}
        />
      )}

      {/* URGENT CLASSIFICATION CARD */}
      {result.urgency === 'urgent' && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500 text-white rounded-2xl flex-shrink-0">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-200/70 px-2.5 py-0.5 rounded-full inline-block">
                Urgent Category
              </span>
              <h2 className="text-2xl font-extrabold text-amber-950">
                {t.urgentTitle}
              </h2>
              <p className="text-sm sm:text-base text-amber-900 leading-relaxed">
                {result.reason}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-medium text-amber-800">
              Seek medical assessment today (within 12 to 24 hours). If chest pain, breathing difficulty, or fainting occurs, call 112 immediately.
            </p>
            <a
              href="tel:112"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl whitespace-nowrap shadow-sm transition"
            >
              Emergency Backup: 112
            </a>
          </div>
        </div>
      )}

      {/* ROUTINE CLASSIFICATION CARD */}
      {result.urgency === 'routine' && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-600 text-white rounded-2xl flex-shrink-0">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-200/70 px-2.5 py-0.5 rounded-full inline-block">
                Routine Category
              </span>
              <h2 className="text-2xl font-extrabold text-emerald-950">
                {t.routineTitle}
              </h2>
              <p className="text-sm sm:text-base text-emerald-900 leading-relaxed">
                {result.reason}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-emerald-200/80 text-xs text-emerald-800">
            <strong>Safety Net:</strong> Symptoms can evolve. If your symptoms worsen, persist beyond a few days, or new severe warning signs develop, schedule a physician consultation or seek immediate care.
          </div>
        </div>
      )}

      {/* INSUFFICIENT INFORMATION CARD */}
      {result.urgency === 'insufficient_information' && (
        <div className="bg-slate-100 border-2 border-slate-300 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-slate-600 text-white rounded-2xl flex-shrink-0">
              <HelpCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-200 px-2.5 py-0.5 rounded-full inline-block">
                Clarification Needed
              </span>
              <h2 className="text-2xl font-extrabold text-navy-950">
                {t.insufficientTitle}
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {result.reason}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Warning Signs Identified Section (if any) */}
      {result.warningSigns.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <AlertOctagon className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-bold text-navy-900">
              Specific Warning Signs Identified
            </h3>
          </div>
          <div className="space-y-3">
            {result.warningSigns.map((ws, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-red-100 text-red-700 mt-0.5">
                  {ws.criticality}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-navy-900">{ws.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{ws.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Next Steps */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-navy-900 pb-2 border-b border-slate-100">
          Recommended Next Steps
        </h3>
        <ul className="space-y-3">
          {result.recommendedActions.map((action, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
              <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-brand-200">
                {i + 1}
              </span>
              <span className="leading-relaxed">{action}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Concise Doctor Health Summary Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-navy-900">
              Clinical Health Summary for Your Doctor
            </h3>
            <p className="text-xs text-slate-500">
              Concise factual summary containing only patient-reported information.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-50 text-brand-700 hover:bg-brand-100 transition border border-brand-200"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : t.copySummary}</span>
            </button>
            <button
              onClick={handleDownloadSummary}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
            >
              <Download className="w-4 h-4" />
              <span>{t.downloadText}</span>
            </button>
          </div>
        </div>

        {/* Factual Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
          <div>
            <span className="font-semibold text-slate-500 block">Reported Symptoms:</span>
            <p className="text-sm font-medium text-navy-900 mt-0.5">
              {result.reportedSymptoms.join(', ') || 'None explicitly listed'}
            </p>
          </div>
          <div>
            <span className="font-semibold text-slate-500 block">Reported Onset:</span>
            <p className="text-sm font-medium text-navy-900 mt-0.5">
              {input.duration || 'Not specified'}
            </p>
          </div>
          <div>
            <span className="font-semibold text-slate-500 block">Reported Severity:</span>
            <p className="text-sm font-medium text-navy-900 mt-0.5 capitalize">
              {input.severity || 'Not specified'}
            </p>
          </div>
          <div>
            <span className="font-semibold text-slate-500 block">Urgency Level:</span>
            <p className="text-sm font-bold text-navy-900 mt-0.5 uppercase">
              {result.urgency}
            </p>
          </div>
        </div>

        {/* Clinical Disclaimer & Limitations */}
        <div className="pt-2">
          <p className="text-[11px] text-slate-500 font-semibold mb-1">Assessment Limitations:</p>
          <ul className="space-y-1 text-[11px] text-slate-500 list-disc list-inside">
            {result.limitations.map((lim, idx) => (
              <li key={idx}>{lim}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <Link
          to="/about"
          className="text-xs text-brand-700 hover:underline flex items-center gap-1"
        >
          <span>Learn how clinical triage rules are structured</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={handleStartNew}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-md transition"
        >
          {t.startNewAssessment}
        </button>
      </div>
    </div>
  );
};
