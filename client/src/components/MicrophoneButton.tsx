import React from 'react';
import { Mic, MicOff, Square, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface MicrophoneButtonProps {
  isListening: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset?: () => void;
  disabled?: boolean;
  isSupported?: boolean;
}

export const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({
  isListening,
  onStart,
  onStop,
  onReset,
  disabled = false,
  isSupported = true
}) => {
  const { t } = useLanguage();

  if (!isSupported) {
    return (
      <div className="flex flex-col items-center p-4 bg-slate-100 rounded-2xl text-center border border-slate-200">
        <MicOff className="w-8 h-8 text-slate-400 mb-2" />
        <p className="text-xs text-slate-600 max-w-sm">
          {t.speechUnavailable}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center my-4">
      {/* Listening Wave Animations Container */}
      <div className="relative flex items-center justify-center">
        {isListening && (
          <>
            <div className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-brand-400/20 animate-ping" />
            <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-brand-500/30 animate-pulse" />
          </>
        )}

        {/* Large Tactile Microphone Button */}
        <button
          type="button"
          onClick={isListening ? onStop : onStart}
          disabled={disabled}
          aria-label={isListening ? t.tapToStop : t.tapToSpeak}
          aria-pressed={isListening}
          className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-lg transition-all transform active:scale-95 focus:outline-none focus:ring-4 ${
            isListening
              ? 'bg-red-600 text-white shadow-red-500/40 ring-red-300 animate-bounce'
              : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/30 ring-brand-300 hover:scale-105'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {isListening ? (
            <Square className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
          ) : (
            <Mic className="w-8 h-8 sm:w-10 sm:h-10" />
          )}
        </button>
      </div>

      {/* Status Label and Audio Bars */}
      <div className="mt-4 text-center">
        {isListening ? (
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span>{t.listening}</span>
            </div>
            {/* Animated Sound Wave Bars */}
            <div className="flex items-center justify-center gap-1 h-5">
              <span className="w-1 bg-red-500 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3" />
              <span className="w-1 bg-red-500 rounded-full animate-[pulse_0.4s_ease-in-out_infinite] h-5" />
              <span className="w-1 bg-red-600 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-4" />
              <span className="w-1 bg-red-500 rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-6" />
              <span className="w-1 bg-red-500 rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-3" />
            </div>
          </div>
        ) : (
          <p className="text-xs sm:text-sm font-medium text-slate-600">
            {t.tapToSpeak}
          </p>
        )}
      </div>

      {/* Action buttons (Reset / Retry) */}
      {onReset && !isListening && (
        <button
          type="button"
          onClick={onReset}
          className="mt-2 text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 underline transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Clear transcript</span>
        </button>
      )}
    </div>
  );
};
