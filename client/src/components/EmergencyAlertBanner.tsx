import React from 'react';
import { AlertOctagon, PhoneCall, Volume2, VolumeX } from 'lucide-react';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useLanguage } from '../context/LanguageContext';

interface EmergencyAlertBannerProps {
  reason: string;
  recommendedActions?: string[];
  primaryContact?: string;
}

export const EmergencyAlertBanner: React.FC<EmergencyAlertBannerProps> = ({
  reason,
  recommendedActions = [],
  primaryContact = '112'
}) => {
  const { t, speechLangCode } = useLanguage();
  const { speak, stop, isSpeaking } = useSpeechSynthesis();

  const handleReadAloud = () => {
    if (isSpeaking) {
      stop();
    } else {
      const speechScript = `Emergency Medical Alert. Seek emergency medical help now. ${reason}. Please call ${primaryContact} immediately. Do not drive yourself.`;
      speak(speechScript, speechLangCode);
    }
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="bg-red-600 text-white rounded-2xl shadow-xl border-4 border-red-700 p-6 sm:p-8 my-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-red-500">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <AlertOctagon className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-bold tracking-widest uppercase bg-white/20 px-2.5 py-0.5 rounded-full inline-block mb-1">
              Priority 1 Emergency
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t.emergencyTitle}
            </h2>
          </div>
        </div>

        {/* Read aloud toggle */}
        <button
          onClick={handleReadAloud}
          aria-label={isSpeaking ? 'Stop emergency guidance speech' : 'Hear emergency guidance spoken aloud'}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold transition border border-white/20 self-stretch sm:self-auto justify-center"
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span>Stop Audio</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span>{t.readAloud}</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-5 space-y-4">
        <div className="bg-red-700/60 p-4 rounded-xl border border-red-500/50">
          <p className="text-base sm:text-lg font-medium leading-relaxed">
            {reason}
          </p>
        </div>

        {/* Big Emergency Call Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <a
            href={`tel:${primaryContact}`}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white text-red-700 font-extrabold text-lg sm:text-xl shadow-lg hover:bg-red-50 transition active:scale-[0.99]"
          >
            <PhoneCall className="w-6 h-6 animate-bounce" />
            <span>Call Emergency Services ({primaryContact})</span>
          </a>
          <a
            href="tel:102"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-base border border-red-500 transition"
          >
            <span>Call Ambulance (102)</span>
          </a>
        </div>

        {/* Clear Life-Saving Advice */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-sm text-red-50">
          <div className="flex items-start gap-2 bg-red-700/40 p-3 rounded-lg">
            <span className="font-bold text-white">•</span>
            <span><strong>Do NOT drive yourself</strong> to the hospital. Request an emergency ambulance with medical equipment.</span>
          </div>
          <div className="flex items-start gap-2 bg-red-700/40 p-3 rounded-lg">
            <span className="font-bold text-white">•</span>
            <span>If you are alone, unlock your front door so emergency responders can enter quickly.</span>
          </div>
        </div>

        {recommendedActions.length > 0 && (
          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-200 mb-2">Immediate Safety Protocol:</h4>
            <ul className="space-y-1.5 text-sm">
              {recommendedActions.map((action, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 flex-shrink-0" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
