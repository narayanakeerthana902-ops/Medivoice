import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../context/LanguageContext';
import { TriageProvider } from '../context/TriageContext';
import { SymptomCheckerPage } from '../pages/SymptomCheckerPage';
import { MicrophoneButton } from '../components/MicrophoneButton';
import { EmergencyAlertBanner } from '../components/EmergencyAlertBanner';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <LanguageProvider>
      <TriageProvider>
        <BrowserRouter>{ui}</BrowserRouter>
      </TriageProvider>
    </LanguageProvider>
  );
};

describe('MediVoice AI Frontend Component Tests', () => {
  it('renders symptom checker and allows users to type and edit symptoms', () => {
    renderWithProviders(<SymptomCheckerPage />);

    const textarea = screen.getByPlaceholderText(/Describe what you are experiencing/i) as HTMLTextAreaElement;
    expect(textarea).toBeInTheDocument();

    fireEvent.change(textarea, { target: { value: 'Severe migraine headache since morning' } });
    expect(textarea.value).toBe('Severe migraine headache since morning');
  });

  it('populates symptom text when a quick example chip is clicked', () => {
    renderWithProviders(<SymptomCheckerPage />);

    const headacheChip = screen.getByText(/\+ Headache/i);
    fireEvent.click(headacheChip);

    const textarea = screen.getByPlaceholderText(/Describe what you are experiencing/i) as HTMLTextAreaElement;
    expect(textarea.value).toContain('headache');
  });

  it('renders text fallback gracefully when voice recognition is unsupported', () => {
    render(
      <LanguageProvider>
        <MicrophoneButton
          isListening={false}
          onStart={() => {}}
          onStop={() => {}}
          isSupported={false}
        />
      </LanguageProvider>
    );

    expect(screen.getByText(/Voice recognition is not supported in this browser/i)).toBeInTheDocument();
  });

  it('renders high-contrast emergency alert banner with emergency 112 dialing button', () => {
    render(
      <LanguageProvider>
        <EmergencyAlertBanner
          reason="Severe crushing chest pain radiating to left arm"
          primaryContact="112"
          recommendedActions={['Sit down and stay calm', 'Call 112 immediately']}
        />
      </LanguageProvider>
    );

    expect(screen.getByText(/Seek Emergency Medical Help Now/i)).toBeInTheDocument();
    expect(screen.getByText(/Call Emergency Services \(112\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Do NOT drive yourself/i)).toBeInTheDocument();
  });
});
