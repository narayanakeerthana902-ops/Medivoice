import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic,
  Send,
  Volume2,
  VolumeX,
  RotateCcw,
  AlertOctagon,
  Sparkles,
  ArrowRight,
  User,
  Activity,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { useTriage } from '../context/TriageContext';
import { useLanguage } from '../context/LanguageContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { sendChatMessage, evaluateTriage } from '../services/api';
import { MicrophoneButton } from '../components/MicrophoneButton';
import { EmergencyAlertBanner } from '../components/EmergencyAlertBanner';
import { LanguageCode } from '../types/triage';

export const VoiceAssistantPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t, speechLangCode } = useLanguage();
  const {
    messages,
    addMessage,
    input,
    setInput,
    setResult,
    resetSession,
    setIsEvaluating
  } = useTriage();

  const [currentText, setCurrentText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [detectedEmergency, setDetectedEmergency] = useState<{ reason: string; contact: string } | null>(null);
  const [showTextFallback, setShowTextFallback] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Speech hooks
  const { speak, stop, isSpeaking, isAudioEnabled, setIsAudioEnabled } = useSpeechSynthesis();

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
      setCurrentText(prev => (prev ? `${prev} ${text}`.trim() : text));
    }
  });

  // Initial greeting if chat is empty
  useEffect(() => {
    if (messages.length === 0) {
      let initialGreeting = "Hello! I am MediVoice AI, your healthcare triage assistant. Please tap the microphone and speak your symptoms naturally, or type below. How are you feeling today?";
      if (language === 'hi') {
        initialGreeting = "नमस्ते! मैं मेडीवॉयस एआई हूँ, आपका स्वास्थ्य मार्गदर्शक। कृपया माइक दबाकर अपने लक्षण बोलें या नीचे लिखें। आप कैसा महसूस कर रहे हैं?";
      } else if (language === 'te') {
        initialGreeting = "నమస్కారం! నేను మెడివాయిస్ AI, మీ ఆరోగ్య సహాయకుడిని. దయచేసి మైక్ నొక్కి మీ లక్షణాలను మాట్లాడండి లేదా కింద టైప్ చేయండి. మీరు ఎలా భావిస్తున్నారు?";
      }
      addMessage({
        role: 'assistant',
        content: initialGreeting
      });
      if (isAudioEnabled) {
        speak(initialGreeting, speechLangCode);
      }
    }
  }, [language]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, detectedEmergency]);

  const handleSendMessage = async (textToSend: string) => {
    const cleanMessage = textToSend.trim();
    if (!cleanMessage || isSending) return;

    // Add user message to state
    addMessage({
      role: 'user',
      content: cleanMessage
    });
    setCurrentText('');
    resetTranscript();
    setIsSending(true);

    try {
      const response = await sendChatMessage(cleanMessage, messages, language);

      // Check if emergency was triggered
      if (response.isEmergencyAlert) {
        setDetectedEmergency({
          reason: response.reply,
          contact: response.emergencyGuidance?.contact || '112'
        });
      }

      // Add assistant response
      addMessage({
        role: 'assistant',
        content: response.reply,
        isEmergency: response.isEmergencyAlert
      });

      // Spoken response if enabled
      if (isAudioEnabled) {
        speak(response.reply, speechLangCode);
      }

      // Update triage input symptoms in context so user can finish anytime
      setInput(prev => ({
        ...prev,
        symptoms: prev.symptoms ? `${prev.symptoms}. ${cleanMessage}` : cleanMessage
      }));
    } catch (err: any) {
      console.error('Chat error:', err);
      addMessage({
        role: 'assistant',
        content: "I'm having trouble processing that right now. If you feel very unwell, please seek emergency medical attention (dial 112) immediately."
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleFinalizeAssessment = async () => {
    setIsEvaluating(true);
    // Gather all user statements into full symptoms
    const allUserText = messages
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .join('. ');

    try {
      const finalResult = await evaluateTriage({
        symptoms: allUserText || input.symptoms || 'General symptom consultation',
        language
      });
      setResult(finalResult);
      navigate('/results');
    } catch (err) {
      console.error('Finalize error:', err);
      navigate('/checker');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleClearChat = () => {
    stop();
    resetTranscript();
    resetSession();
    setDetectedEmergency(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-semibold mb-2">
            <Mic className="w-3.5 h-3.5 text-brand-600" />
            <span>Voice-First AI Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Speak Your Symptoms
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Natural voice conversation with clinical emergency interception.
          </p>
        </div>

        {/* Toggles (Audio, Language, Reset) */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* TTS Audio Response Toggle */}
          <button
            onClick={() => {
              if (isSpeaking) stop();
              setIsAudioEnabled(!isAudioEnabled);
            }}
            title={isAudioEnabled ? 'Mute spoken responses' : 'Enable spoken responses'}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition border ${
              isAudioEnabled
                ? 'bg-brand-50 text-brand-700 border-brand-200 hover:bg-brand-100'
                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {isAudioEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-brand-600" />
                <span>Voice Audio ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Voice Audio Muted</span>
              </>
            )}
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 border border-slate-200">
            <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="bg-transparent text-xs font-semibold text-slate-700 py-1 px-1 rounded focus:outline-none cursor-pointer"
            >
              <option value="en">English (US/IN)</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="te">తెలుగు (Telugu)</option>
            </select>
          </div>

          {/* Reset Conversation */}
          <button
            onClick={handleClearChat}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
            title="Start new conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Immediate Emergency Banner if Emergency Detected */}
      {detectedEmergency && (
        <div className="my-6">
          <EmergencyAlertBanner
            reason={detectedEmergency.reason}
            primaryContact={detectedEmergency.contact}
          />
        </div>
      )}

      {/* Conversation Thread */}
      <div className="my-6 space-y-4 min-h-[320px] max-h-[480px] overflow-y-auto p-4 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs ${
                msg.role === 'user'
                  ? 'bg-navy-900'
                  : msg.isEmergency
                  ? 'bg-red-600 animate-pulse'
                  : 'bg-brand-600'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-brand-600 text-white rounded-tr-none'
                  : msg.isEmergency
                  ? 'bg-red-50 text-red-900 border border-red-200 rounded-tl-none font-medium'
                  : 'bg-slate-100 text-slate-800 rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <div
                className={`text-[10px] mt-1.5 flex items-center gap-1 ${
                  msg.role === 'user' ? 'text-brand-100 justify-end' : 'text-slate-400'
                }`}
              >
                <span>{msg.timestamp}</span>
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => speak(msg.content, speechLangCode)}
                    className="ml-2 hover:text-brand-600"
                    title="Repeat speech"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs">
              <Activity className="w-4 h-4" />
            </div>
            <div className="bg-slate-100 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-600 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-brand-600 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-brand-600 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-slate-500 font-medium ml-1">Evaluating safety rules...</span>
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Voice Interaction & Editable Transcript Box */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        {/* Large Central Microphone Control */}
        <div className="flex flex-col items-center">
          <MicrophoneButton
            isListening={isListening}
            onStart={startListening}
            onStop={stopListening}
            isSupported={isSupported}
          />

          {speechError && (
            <p className="text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-lg mt-2 border border-red-200">
              {speechError}
            </p>
          )}

          {interimTranscript && (
            <p className="text-xs text-brand-700 italic animate-pulse mt-2">
              Hearing: "{interimTranscript}"
            </p>
          )}
        </div>

        {/* Editable Transcript & Message Input */}
        <div>
          <label htmlFor="voice-transcript" className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
            <span>Recognized Speech / Message: (You can edit before sending)</span>
            {currentText && (
              <button
                type="button"
                onClick={() => setCurrentText('')}
                className="text-slate-400 hover:text-slate-600 font-normal"
              >
                Clear
              </button>
            )}
          </label>
          <div className="flex items-center gap-2">
            <input
              id="voice-transcript"
              type="text"
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendMessage(currentText);
                }
              }}
              placeholder="Speak using microphone or type message here..."
              className="flex-1 rounded-xl border-slate-200 bg-slate-50 focus:bg-white text-sm text-navy-900 py-3 px-4 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
            />
            <button
              type="button"
              onClick={() => handleSendMessage(currentText)}
              disabled={!currentText.trim() || isSending}
              className="p-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl shadow-md transition active:scale-95"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Bar: Finalize Assessment Button */}
        {messages.filter(m => m.role === 'user').length >= 1 && (
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Have you described enough? Ready to view your full triage results?
            </span>
            <button
              type="button"
              onClick={handleFinalizeAssessment}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-navy-900 hover:bg-navy-950 text-white shadow-md transition active:scale-95"
            >
              <span>View Full Triage Results</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
