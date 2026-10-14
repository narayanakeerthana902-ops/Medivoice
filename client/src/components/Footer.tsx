import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-navy-900">
                MediVoice<span className="text-brand-600">.AI</span>
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                Prototype v1.0.0
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              An accessible, voice-first preliminary triage assistant designed for student hackathon demonstration.
              Aims to assist users in understanding symptom urgency through rule-based triage.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <span>In-memory temporary sessions • Zero audio retention</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-semibold text-navy-900 uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/" className="hover:text-brand-600 transition">{t.home}</Link>
              </li>
              <li>
                <Link to="/checker" className="hover:text-brand-600 transition">{t.symptomChecker}</Link>
              </li>
              <li>
                <Link to="/assistant" className="hover:text-brand-600 transition">{t.voiceAssistant}</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-600 transition">{t.about}</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-brand-600 transition">{t.privacy}</Link>
              </li>
            </ul>
          </div>

          {/* Emergency & Safety Notice */}
          <div>
            <h4 className="text-xs font-semibold text-red-700 uppercase tracking-wider mb-3 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Emergency Services
            </h4>
            <p className="text-xs text-slate-600 mb-2">
              If experiencing chest pain, severe shortness of breath, stroke signs, or trauma:
            </p>
            <a
              href="tel:112"
              className="inline-flex items-center justify-center w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
            >
              Dial 112 (India) / Local 911
            </a>
          </div>
        </div>

        {/* Clinical Disclaimer Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 text-center sm:text-left">
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong className="text-slate-700">Safety Disclaimer:</strong> {t.safetyDisclaimer}
          </p>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} MediVoice AI Project. Developed for Student Hackathon.</p>
          <div className="flex items-center gap-1">
            <span>Built with care for accessible healthcare</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
