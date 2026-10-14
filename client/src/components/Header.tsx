import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Mic, ShieldAlert, Globe, Menu, X, PhoneCall } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode } from '../types/triage';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:bg-brand-700 transition">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-navy-900 group-hover:text-brand-600 transition">
                MediVoice<span className="text-brand-600 font-extrabold">.AI</span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block leading-none">
                Healthcare Triage Assistant
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/') ? 'text-brand-700 bg-brand-50' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
              }`}
            >
              {t.home}
            </Link>
            <Link
              to="/checker"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/checker') ? 'text-brand-700 bg-brand-50' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
              }`}
            >
              {t.symptomChecker}
            </Link>
            <Link
              to="/assistant"
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition ${
                isActive('/assistant') ? 'text-brand-700 bg-brand-50' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
              }`}
            >
              <Mic className="w-4 h-4 text-brand-600" />
              {t.voiceAssistant}
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/about') ? 'text-brand-700 bg-brand-50' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
              }`}
            >
              {t.about}
            </Link>
          </nav>

          {/* Actions & Language Selector */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative flex items-center gap-1 bg-slate-100 rounded-lg p-1 border border-slate-200">
              <Globe className="w-4 h-4 text-slate-500 ml-1.5" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                aria-label="Select Language"
                className="bg-transparent text-xs font-semibold text-slate-700 py-1 pl-1 pr-2 rounded focus:outline-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="te">తెలుగు (Telugu)</option>
              </select>
            </div>

            {/* Quick 112 emergency call button */}
            <a
              href="tel:112"
              title="Call National Emergency Services (112)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5 text-red-600" />
              <span>112</span>
            </a>

            {/* Start Checking CTA */}
            <Link
              to="/checker"
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 transition shadow-sm shadow-brand-500/20 active:scale-[0.98]"
            >
              {t.startChecking}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="tel:112"
              className="p-2 rounded-lg text-red-700 bg-red-50 border border-red-200"
              aria-label="Call Emergency 112"
            >
              <PhoneCall className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-xs font-medium text-slate-500">Language:</span>
            <div className="flex gap-2">
              {(['en', 'hi', 'te'] as LanguageCode[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2.5 py-1 text-xs rounded font-medium ${
                    language === lang ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिंदी' : 'తెలుగు'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
            >
              {t.home}
            </Link>
            <Link
              to="/checker"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
            >
              {t.symptomChecker}
            </Link>
            <Link
              to="/assistant"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
            >
              <Mic className="w-4 h-4 text-brand-600" />
              {t.voiceAssistant}
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
            >
              {t.about}
            </Link>
            <Link
              to="/privacy"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
            >
              {t.privacy}
            </Link>
          </div>
          <div className="pt-2">
            <Link
              to="/checker"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-2.5 rounded-lg font-semibold bg-brand-600 text-white shadow-sm"
            >
              {t.startChecking}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
