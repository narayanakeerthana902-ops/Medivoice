import { Request, Response } from 'express';
import { SummaryRequestSchema } from '../schemas/apiSchemas.js';
import { aiAdapter } from '../services/ai/adapter.js';

export const handleSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = SummaryRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Validation Error',
        details: parseResult.error.errors.map(e => e.message)
      });
      return;
    }

    const summary = await aiAdapter.generateSummary(parseResult.data);
    res.status(200).json(summary);
  } catch (err: any) {
    console.error('Error generating summary:', err?.message);
    res.status(500).json({
      error: 'Summary Generation Error',
      message: 'Failed to generate factual health summary.'
    });
  }
};
