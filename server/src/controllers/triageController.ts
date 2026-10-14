import { Request, Response } from 'express';
import { TriageRequestSchema } from '../schemas/apiSchemas.js';
import { triageEngine } from '../triage/engine.js';

export const handleTriage = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = TriageRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Validation Error',
        details: parseResult.error.errors.map(e => e.message)
      });
      return;
    }

    const input = parseResult.data;
    // Execute deterministic triage engine
    const evaluation = triageEngine.evaluate(input);

    res.status(200).json(evaluation);
  } catch (err: any) {
    console.error('Error during triage evaluation:', err?.message);
    res.status(500).json({
      error: 'Triage Processing Error',
      message: 'An unexpected error occurred during safety rule evaluation.'
    });
  }
};
