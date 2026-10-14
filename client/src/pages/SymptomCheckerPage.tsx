import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, ArrowRight, RotateCcw, AlertCircle, Info, Sparkles, Check, HeartPulse } from 'lucide-react';
import { useTriage } from '../context/TriageContext';
import { useLanguage } from '../context/LanguageContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { MicrophoneButton } from '../components/MicrophoneButton';
import { evaluateTriage } from '../services/api';

const EXAMPLE_SYMPTOMS = [
  'Headache',
  'Fever',
  'Cough',
  'Abdominal pain',
  'Dizziness',
  'Breathing difficulties',
  'Chest discomfort'
];

export const SymptomCheckerPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language, speechLangCode } = useLanguage();
  const { input, setInput, updateInputField, setResult, resetSession, isEvaluating, setIsEvaluating } = useTriage();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Speech Recognition hook
  const {
    isListening,
    transcript,
    setTranscript,
    interimTranscript,
    error: speechError,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition({
    lang: speechLangCode,
    onTranscriptChange: (text) => {
      // Append or set transcript into the symptoms field
      setInput(prev => ({
        ...prev,
        symptoms: prev.symptoms ? `${prev.symptoms} ${text}`.trim() : text
      }));
    }
  });

  const handleExampleSelect = (example: string) => {
    setInput(prev => ({
      ...prev,
      symptoms: prev.symptoms ? `${prev.symptoms}, ${example}` : `I am experiencing ${example.toLowerCase()}`
    }));
  };

  const handleClearAll = () => {
    resetSession();
    resetTranscript();
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const symptomText = input.symptoms.trim();
    if (!symptomText) {
      setErrorMessage('Please describe what symptoms you are experiencing before submitting.');
      return;
    }

    setIsEvaluating(true);
    try {
      const evaluation = await evaluateTriage({
        ...input,
        language
      });
      setResult(evaluation);
      navigate('/results');
    } catch (err: any) {
      console.error('Triage submission error:', err);
      setErrorMessage(err.message || 'Unable to connect to the triage service. Please check your network and try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-semibold mb-3">
          <HeartPulse className="w-3.5 h-3.5 text-brand-600" />
          <span>Preliminary Healthcare Triage</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
          Describe Your Symptoms
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          Speak with your microphone or type naturally. You can review and edit your words at any time before submitting.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Symptom Input Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <label htmlFor="symptoms-input" className="block text-sm font-bold text-navy-900">
                What are you experiencing? <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-slate-500">
                Be as specific as you like. Mention when it started or if it hurts more with movement.
              </p>
            </div>

            {/* Quick Clear Button */}
            {input.symptoms && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Form</span>
              </button>
            )}
          </div>

          {/* Voice Input Controller */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-4">
            <div className="flex flex-col items-center">
              <MicrophoneButton
                isListening={isListening}
                onStart={startListening}
                onStop={stopListening}
                onReset={resetTranscript}
                isSupported={isSupported}
              />
              {interimTranscript && (
                <p className="text-xs text-brand-700 italic mt-2 animate-pulse">
                  Recognizing: "{interimTranscript}"
                </p>
              )}
              {speechError && (
                <div className="mt-3 flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{speechError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Text Area Input */}
          <div className="relative">
            <textarea
              id="symptoms-input"
              rows={4}
              value={input.symptoms}
              onChange={(e) => updateInputField('symptoms', e.target.value)}
              placeholder="Describe what you are experiencing. For example: I have had a headache since this morning and feel dizzy."
              className="w-full rounded-2xl border-slate-200 bg-white p-4 text-sm sm:text-base text-navy-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition resize-y shadow-inner"
              required
            />
          </div>

          {/* Preset Example Symptom Chips */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Select common examples to add:</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_SYMPTOMS.map((symptom) => (
                <button
                  key={symptom}
                  type="button"
                  onClick={() => handleExampleSelect(symptom)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 border border-slate-200 hover:border-brand-300 transition"
                >
                  + {symptom}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Optional Clinical Context Fields */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Info className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wide">
              Optional Context (Improves Guidance)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Duration Selector */}
            <div>
              <label htmlFor="duration-select" className="block text-xs font-semibold text-slate-700 mb-2">
                Symptom Duration
              </label>
              <select
                id="duration-select"
                value={input.duration || ''}
                onChange={(e) => updateInputField('duration', e.target.value)}
                className="w-full rounded-xl border-slate-200 text-sm py-2.5 px-3 bg-white text-navy-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="">Select duration...</option>
                <option value="Just started / Past hour">Just started / Past hour</option>
                <option value="Since this morning">Since this morning</option>
                <option value="1 to 2 days">1 to 2 days</option>
                <option value="3 to 7 days">3 to 7 days</option>
                <option value="More than a week">More than a week</option>
                <option value="Several weeks or months">Several weeks or months</option>
              </select>
            </div>

            {/* Severity Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Severity Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['mild', 'moderate', 'severe'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => updateInputField('severity', level)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold capitalize transition border ${
                      input.severity === level
                        ? level === 'severe'
                          ? 'bg-red-50 text-red-700 border-red-300 ring-2 ring-red-400'
                          : level === 'moderate'
                          ? 'bg-amber-50 text-amber-800 border-amber-300 ring-2 ring-amber-400'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-400'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Age Range Selector */}
            <div>
              <label htmlFor="age-select" className="block text-xs font-semibold text-slate-700 mb-2">
                Age Bracket
              </label>
              <select
                id="age-select"
                value={input.ageRange || ''}
                onChange={(e) => updateInputField('ageRange', e.target.value as any)}
                className="w-full rounded-xl border-slate-200 text-sm py-2.5 px-3 bg-white text-navy-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="">Select age bracket...</option>
                <option value="child">Child (Under 12)</option>
                <option value="teen">Teen (12 - 17)</option>
                <option value="adult">Adult (18 - 64)</option>
                <option value="senior">Senior (65+)</option>
              </select>
            </div>
          </div>

          {/* Additional notes */}
          <div>
            <label htmlFor="additional-info" className="block text-xs font-semibold text-slate-700 mb-2">
              Additional Information (e.g., relevant medical history, medications, allergies)
            </label>
            <input
              type="text"
              id="additional-info"
              value={input.additionalInfo || ''}
              onChange={(e) => updateInputField('additionalInfo', e.target.value)}
              placeholder="e.g. Taking blood pressure medication, history of asthma..."
              className="w-full rounded-xl border-slate-200 text-sm p-3 bg-white text-navy-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        {/* Error message presentation */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 text-sm text-red-800">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Unable to process assessment</p>
              <p className="text-xs text-red-700 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Submit Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            By submitting, you acknowledge this is an unvalidated prototype for preliminary guidance only.
          </p>

          <button
            type="submit"
            disabled={isEvaluating}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/25 transition active:scale-[0.98] disabled:opacity-60"
          >
            {isEvaluating ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Evaluating Safety Rules...</span>
              </>
            ) : (
              <>
                <span>Submit Symptoms for Triage</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
