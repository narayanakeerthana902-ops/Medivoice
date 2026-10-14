import { Router, Request, Response } from 'express';
import { handleTriage } from '../controllers/triageController.js';
import { handleChat } from '../controllers/chatController.js';
import { handleSummary } from '../controllers/summaryController.js';
import { RULESET_VERSION } from '../triage/rules.js';

export const apiRouter = Router();

apiRouter.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    service: 'MediVoice AI Healthcare Triage Service',
    rulesetVersion: RULESET_VERSION,
    timestamp: new Date().toISOString(),
    aiProvider: process.env.AI_PROVIDER || 'local-heuristic',
    storageMode: 'ephemeral-in-memory',
    isClinicallyValidated: false
  });
});

apiRouter.post('/triage', handleTriage);
apiRouter.post('/assistant/chat', handleChat);
apiRouter.post('/assistant/summarize', handleSummary);
