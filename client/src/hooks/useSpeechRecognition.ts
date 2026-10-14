import { useState, useEffect, useRef, useCallback } from 'react';

// Declaration for browser SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface UseSpeechRecognitionOptions {
  lang?: string;
  onTranscriptChange?: (text: string) => void;
}

export const useSpeechRecognition = ({
  lang = 'en-US',
  onTranscriptChange
}: UseSpeechRecognitionOptions = {}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalized = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalized += event.results[i][0].transcript + ' ';
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        setInterimTranscript(currentInterim);
        if (finalized) {
          setTranscript(prev => {
            const updated = (prev + ' ' + finalized).trim();
            if (onTranscriptChange) onTranscriptChange(updated);
            return updated;
          });
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('[SpeechRecognition Error]', event.error);
        if (event.error === 'not-allowed') {
          setError('Microphone permission was denied. Please allow microphone access in your browser settings.');
        } else if (event.error === 'no-speech') {
          setError('No speech was detected. Please try speaking closer to the microphone.');
        } else if (event.error === 'network') {
          setError('Network issue connecting to browser speech service. You can type your symptoms below.');
        } else {
          setError(`Voice input issue: ${event.error}. You can type in the box below.`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
    } catch (err: any) {
      console.warn('SpeechRecognition initialization error:', err);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, [lang]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    setError(null);
    try {
      recognitionRef.current.start();
    } catch (err: any) {
      // If already started or aborting, stop and restart
      try {
        recognitionRef.current.stop();
        setTimeout(() => recognitionRef.current?.start(), 150);
      } catch (_) {}
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (_) {}
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    setTranscript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  };
};
