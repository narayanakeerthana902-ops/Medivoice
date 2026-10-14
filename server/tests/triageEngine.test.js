import { describe, it, expect } from 'vitest';
import { triageEngine } from '../src/triage/engine.js';
describe('MediVoice AI Deterministic Triage Engine Tests', () => {
    it('identifies emergency warning signs and produces emergency guidance for acute chest pain', () => {
        const input = {
            symptoms: 'I have severe crushing chest pain radiating to my left arm and jaw',
            severity: 'severe'
        };
        const result = triageEngine.evaluate(input);
        expect(result.urgency).toBe('emergency');
        expect(result.emergencyContact.primary).toBe('112');
        expect(result.warningSigns.length).toBeGreaterThan(0);
        expect(result.reason).toContain('Cardiac Warning Signs');
    });
    it('identifies severe respiratory distress as emergency', () => {
        const input = {
            symptoms: 'Gasping for air and cannot breathe properly, lips turning blue'
        };
        const result = triageEngine.evaluate(input);
        expect(result.urgency).toBe('emergency');
        expect(result.warningSigns.some(ws => ws.id === 'WS_RESPIRATORY')).toBe(true);
    });
    it('identifies stroke symptoms (FAST) as emergency', () => {
        const input = {
            symptoms: 'My mother has sudden facial drooping and cannot speak clearly, one-sided arm weakness'
        };
        const result = triageEngine.evaluate(input);
        expect(result.urgency).toBe('emergency');
        expect(result.warningSigns.some(ws => ws.id === 'WS_STROKE')).toBe(true);
    });
    it('ensures emergency warning signs always override routine symptoms (highest urgency precedence)', () => {
        const input = {
            symptoms: 'I have a mild runny nose and slight cough, but also crushing chest pain'
        };
        const result = triageEngine.evaluate(input);
        expect(result.urgency).toBe('emergency');
        expect(result.urgency).not.toBe('routine');
    });
    it('does not default missing or vague information to routine classification', () => {
        const vagueInputs = [
            { symptoms: '' },
            { symptoms: '   ' },
            { symptoms: 'help' },
            { symptoms: 'I feel sick' },
            { symptoms: 'hello' }
        ];
        for (const input of vagueInputs) {
            const result = triageEngine.evaluate(input);
            expect(result.urgency).toBe('insufficient_information');
            expect(result.urgency).not.toBe('routine');
            expect(result.followUpQuestions.length).toBeGreaterThan(0);
        }
    });
    it('classifies uncomplicated mild symptoms as routine only when no red flags are present', () => {
        const input = {
            symptoms: 'I have a mild cold, runny nose and sneezing since yesterday',
            severity: 'mild'
        };
        const result = triageEngine.evaluate(input);
        expect(result.urgency).toBe('routine');
        expect(result.warningSigns.length).toBe(0);
    });
    it('classifies acute significant abdominal pain as urgent', () => {
        const input = {
            symptoms: 'Sharp severe abdominal pain in the right lower side with fever and vomiting',
            severity: 'moderate'
        };
        const result = triageEngine.evaluate(input);
        expect(result.urgency).toBe('urgent');
        expect(result.warningSigns.some(ws => ws.id === 'WS_ACUTE_ABDOMEN')).toBe(true);
    });
    it('evaluates emergency signs expressed in Hindi / Indian languages', () => {
        const input = {
            symptoms: 'मुझे बहुत तेज छाती में दर्द हो रहा है और सांस लेने में तकलीफ है'
        };
        const result = triageEngine.evaluate(input);
        expect(result.urgency).toBe('emergency');
    });
    it('evaluates emergency signs expressed in Telugu', () => {
        const input = {
            symptoms: 'తీవ్రమైన గుండె నొప్పి మరియు ఊపిరి ఆడటం లేదు'
        };
        const result = triageEngine.evaluate(input);
        expect(result.urgency).toBe('emergency');
    });
    it('operates deterministically without requiring any external AI provider or API key', () => {
        // Engine does not access process.env or external APIs
        const input = {
            symptoms: 'Sudden loss of consciousness, passed out and not waking up'
        };
        const result = triageEngine.evaluate(input);
        expect(result.urgency).toBe('emergency');
        expect(result.rulesetVersion).toBe('prototype-1.0.0');
        expect(result.isClinicallyValidated).toBe(false);
    });
});
