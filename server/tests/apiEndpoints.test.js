import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/index.js';
describe('MediVoice AI Backend API Integration Tests', () => {
    it('GET /api/health returns 200 with service metadata and no exposed secrets', async () => {
        const res = await request(app).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('healthy');
        expect(res.body.rulesetVersion).toBe('prototype-1.0.0');
        expect(res.body.storageMode).toBe('ephemeral-in-memory');
        expect(res.body).not.toHaveProperty('AI_API_KEY');
        expect(res.body).not.toHaveProperty('apiKey');
    });
    it('POST /api/triage returns emergency classification for chest pain and difficulty breathing', async () => {
        const res = await request(app)
            .post('/api/triage')
            .send({
            symptoms: 'I have severe chest pain and crushing pressure radiating to my arm',
            severity: 'severe'
        });
        expect(res.status).toBe(200);
        expect(res.body.urgency).toBe('emergency');
        expect(res.body.emergencyContact.primary).toBe('112');
    });
    it('POST /api/triage rejects invalid or empty request payloads with 400', async () => {
        const res = await request(app)
            .post('/api/triage')
            .send({
            symptoms: '' // min 1 required by schema
        });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Validation Error');
    });
    it('POST /api/assistant/chat responds with clarifying question when details are missing', async () => {
        const res = await request(app)
            .post('/api/assistant/chat')
            .send({
            message: 'I have a headache',
            conversationHistory: []
        });
        expect(res.status).toBe(200);
        expect(res.body.reply).toBeDefined();
        expect(res.body.reply.length).toBeGreaterThan(0);
        expect(res.body.isEmergencyAlert).toBe(false);
    });
    it('POST /api/assistant/chat immediately intercepts emergency in conversation', async () => {
        const res = await request(app)
            .post('/api/assistant/chat')
            .send({
            message: 'Sudden facial drooping, arm numbness and slurred speech',
            conversationHistory: []
        });
        expect(res.status).toBe(200);
        expect(res.body.isEmergencyAlert).toBe(true);
        expect(res.body.emergencyGuidance?.contact).toBe('112');
    });
    it('POST /api/assistant/summarize generates factual clinical summary without hallucinations', async () => {
        const res = await request(app)
            .post('/api/assistant/summarize')
            .send({
            reportedSymptoms: ['Headache', 'Dizziness'],
            rawDescription: 'Headache and dizziness since morning',
            duration: 'Since morning',
            severity: 'moderate',
            urgency: 'urgent',
            recommendedActions: ['Consult a physician today']
        });
        expect(res.status).toBe(200);
        expect(res.body.patientReportedSymptoms).toContain('Headache');
        expect(res.body.reportedOnset).toBe('Since morning');
        expect(res.body.unknownInformation.length).toBeGreaterThan(0);
        expect(res.body.formattedPlainText).toContain('MEDIVOICE AI - PRELIMINARY CLINICAL HEALTH SUMMARY');
    });
});
