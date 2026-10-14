import '@testing-library/jest-dom';

// Mock window.speechSynthesis
Object.defineProperty(window, 'speechSynthesis', {
  value: {
    speak: () => {},
    cancel: () => {},
    pause: () => {},
    resume: () => {},
    getVoices: () => []
  },
  writable: true
});

// Mock window.SpeechRecognition
(window as any).SpeechRecognition = function () {
  return {
    start: () => {},
    stop: () => {},
    abort: () => {},
    continuous: true,
    interimResults: true,
    lang: 'en-US'
  };
};
