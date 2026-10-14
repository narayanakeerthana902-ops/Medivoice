import React, { useState } from 'react';
import { ShieldCheck, Lock, Trash2, CheckCircle2, EyeOff, MicOff, AlertCircle } from 'lucide-react';
import { useTriage } from '../context/TriageContext';

export const PrivacyPage: React.FC = () => {
  const { resetSession } = useTriage();
  const [clearedMessage, setClearedMessage] = useState(false);

  const handlePurge = () => {
    resetSession();
    setClearedMessage(true);
    setTimeout(() => setClearedMessage(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-semibold mb-3">
          <Lock className="w-3.5 h-3.5 text-brand-600" />
          <span>Patient Privacy Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
          Privacy by Design
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          Health information is sacred and sensitive. Here is exactly how your data is handled.
        </p>
      </div>

      {/* Discard Session Control */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md">
        <div>
          <h2 className="text-lg font-bold">Ephemeral In-Memory State</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            MediVoice AI holds your symptom report only in temporary browser memory during your active tab session. You can purge all active data with one click.
          </p>
        </div>
        <button
          onClick={handlePurge}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-md transition active:scale-95 whitespace-nowrap self-stretch sm:self-auto justify-center"
        >
          <Trash2 className="w-4 h-4" />
          <span>{clearedMessage ? 'Session Cleared!' : 'Discard Current Session'}</span>
        </button>
      </div>

      {/* Key Privacy Commitments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-navy-900">No Account or Personal Identifiers</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            You do not need to register, provide your name, phone number, email address, or social security ID to check symptoms.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <MicOff className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-navy-900">Zero Audio Recording Retention</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Speech-to-text occurs directly in your browser using the Web Speech API. Audio wave files are not saved, retained, or uploaded to permanent server disks.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-navy-900">No Advertising Trackers</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            There are zero third-party commercial advertising pixels, tracking cookies, or data brokers embedded in this application.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-navy-900">Privacy-Preserving Server Logs</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Our backend servers log HTTP status codes and response latencies only. Full symptom text and conversational payloads are filtered out of production logs.
          </p>
        </div>
      </div>

      {/* External AI Disclosure */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-navy-900">Disclosure Regarding External AI Providers</h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          MediVoice AI operates by default using a safe, local clinical heuristic engine that does not transmit your text to any external cloud AI provider.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          If the application owner has configured an optional external AI provider (such as Google Gemini or OpenAI) via backend environment variables, symptom text is transmitted over encrypted TLS connections solely for language comprehension and follow-up generation, without personal identifying information.
        </p>
      </div>
    </div>
  );
};
