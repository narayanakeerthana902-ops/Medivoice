import React, { createContext, useContext, useState } from 'react';
import { TriageInput, TriageResult, ChatMessage, ClinicalSummary } from '../types/triage';

interface TriageContextType {
  input: TriageInput;
  setInput: React.Dispatch<React.SetStateAction<TriageInput>>;
  updateInputField: (field: keyof TriageInput, value: any) => void;
  result: TriageResult | null;
  setResult: (res: TriageResult | null) => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  summary: ClinicalSummary | null;
  setSummary: (sum: ClinicalSummary | null) => void;
  resetSession: () => void;
  isEvaluating: boolean;
  setIsEvaluating: (val: boolean) => void;
}

const defaultInput: TriageInput = {
  symptoms: '',
  duration: '',
  severity: undefined,
  ageRange: undefined,
  additionalInfo: '',
  language: 'en'
};

const TriageContext = createContext<TriageContextType | undefined>(undefined);

export const TriageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [input, setInput] = useState<TriageInput>(defaultInput);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [summary, setSummary] = useState<ClinicalSummary | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const updateInputField = (field: keyof TriageInput, value: any) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const resetSession = () => {
    setInput(defaultInput);
    setResult(null);
    setMessages([]);
    setSummary(null);
    setIsEvaluating(false);
  };

  return (
    <TriageContext.Provider
      value={{
        input,
        setInput,
        updateInputField,
        result,
        setResult,
        messages,
        setMessages,
        addMessage,
        summary,
        setSummary,
        resetSession,
        isEvaluating,
        setIsEvaluating
      }}
    >
      {children}
    </TriageContext.Provider>
  );
};

export const useTriage = (): TriageContextType => {
  const context = useContext(TriageContext);
  if (!context) {
    throw new Error('useTriage must be used within a TriageProvider');
  }
  return context;
};
