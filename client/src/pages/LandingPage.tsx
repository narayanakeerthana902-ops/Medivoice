import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, ArrowRight, ShieldCheck, HeartPulse, FileText, CheckCircle2, AlertTriangle, Sparkles, UserCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SafetyDisclaimerCard } from '../components/SafetyDisclaimerCard';

export const LandingPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline and CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-semibold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Accessible AI Healthcare Hackathon Project</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-950 tracking-tight leading-[1.15]">
                {t.heroHeadline}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t.heroDesc}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/checker"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/25 transition active:scale-[0.98]"
                >
                  <span>{t.checkSymptomsCTA}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/assistant"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-navy-900 bg-white border border-slate-300 hover:bg-slate-50 shadow-sm transition active:scale-[0.98]"
                >
                  <Mic className="w-4 h-4 text-brand-600" />
                  <span>{t.talkToAICTA}</span>
                </Link>
              </div>

              {/* Key Trust Signals */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-500 pt-4">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>No login required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Voice input in 3 languages</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Clinical triage rule precedence</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Healthcare Card Illustration */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 overflow-hidden">
                {/* Visual badge top */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700">
                      <Mic className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-navy-900">Voice Assistant Active</h4>
                      <p className="text-[11px] text-slate-500">Listening in real-time...</p>
                    </div>
                  </div>
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                </div>

                {/* Simulated Conversation Preview */}
                <div className="my-5 space-y-3">
                  <div className="bg-slate-100 rounded-2xl p-3.5 max-w-[85%] text-xs text-slate-800 ml-auto border border-slate-200">
                    <p className="font-semibold text-slate-600 text-[10px] mb-0.5">You spoke:</p>
                    "I have had a throbbing headache since this morning and feel slightly dizzy."
                  </div>

                  <div className="bg-brand-50 rounded-2xl p-3.5 max-w-[90%] text-xs text-brand-950 border border-brand-100">
                    <p className="font-semibold text-brand-700 text-[10px] mb-0.5">MediVoice AI:</p>
                    "I understand. When did the dizziness start, and are you having any vision changes or numbness?"
                  </div>
                </div>

                {/* Simulated Urgency Assessment pill */}
                <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HeartPulse className="w-5 h-5 text-amber-600" />
                      <span className="text-xs font-bold text-amber-900">Preliminary Assessment</span>
                    </div>
                    <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-200/70 text-amber-800">
                      Urgent Review
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800 mt-1.5 leading-snug">
                    Symptoms warrant prompt outpatient clinical evaluation.
                  </p>
                </div>

                {/* Dial 112 quick banner */}
                <div className="mt-3 flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-500 border border-slate-100">
                  <span>Emergency contact:</span>
                  <strong className="text-red-600 font-bold">112 (India)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">Core Capabilities</h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-navy-900">
            Designed for Accessibility and Rapid Clarity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 mb-4 border border-brand-100">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-navy-900 mb-2">{t.voiceFirstTitle}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{t.voiceFirstDesc}</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 border border-blue-100">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-navy-900 mb-2">{t.aiAssistantTitle}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{t.aiAssistantDesc}</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4 border border-amber-100">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-navy-900 mb-2">{t.urgencyTitle}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{t.urgencyDesc}</p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4 border border-emerald-100">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-navy-900 mb-2">{t.summaryTitle}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{t.summaryDesc}</p>
          </div>
        </div>
      </section>

      {/* 3-Step Process Section */}
      <section className="bg-white py-14 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">How It Works</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-navy-900">
              Three Simple Steps to Guidance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-black text-sm flex items-center justify-center mb-4 shadow-sm">
                1
              </div>
              <h3 className="text-base font-bold text-navy-900 mb-2">{t.step1}</h3>
              <p className="text-xs sm:text-sm text-slate-600">{t.step1Desc}</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-black text-sm flex items-center justify-center mb-4 shadow-sm">
                2
              </div>
              <h3 className="text-base font-bold text-navy-900 mb-2">{t.step2}</h3>
              <p className="text-xs sm:text-sm text-slate-600">{t.step2Desc}</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-black text-sm flex items-center justify-center mb-4 shadow-sm">
                3
              </div>
              <h3 className="text-base font-bold text-navy-900 mb-2">{t.step3}</h3>
              <p className="text-xs sm:text-sm text-slate-600">{t.step3Desc}</p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/checker"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md transition"
            >
              <span>{t.startChecking}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Safety Disclaimer Callout */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SafetyDisclaimerCard />
      </section>
    </div>
  );
};
