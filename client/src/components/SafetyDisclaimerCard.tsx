import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const SafetyDisclaimerCard: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { t } = useLanguage();

  if (compact) {
    return (
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
        <Info className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Notice:</strong> {t.safetyDisclaimer}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-brand-50 to-blue-50 border border-brand-200 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-brand-600 text-white rounded-lg flex-shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1.5">
          <h4 className="text-sm font-bold text-navy-900 uppercase tracking-wide">
            Clinical Safety & Prototype Disclaimer
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t.safetyDisclaimer}
          </p>
          <div className="pt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            <span>• Unvalidated Prototype Ruleset (v1.0.0)</span>
            <span>• Temporary In-Memory Session</span>
            <span>• Dial 112 for Emergencies</span>
          </div>
        </div>
      </div>
    </div>
  );
};
