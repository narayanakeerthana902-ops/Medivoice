import { Request, Response } from 'express';
import { ChatRequestSchema } from '../schemas/apiSchemas.js';
import { aiAdapter } from '../services/ai/adapter.js';

export const handleChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = ChatRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Validation Error',
        details: parseResult.error.errors.map(e => e.message)
      });
      return;
    }

    const { message, conversationHistory, language } = parseResult.data;

    const chatResponse = await aiAdapter.generateChat(
      message,
      conversationHistory,
      language as 'en' | 'hi' | 'te'
    );

    res.status(200).json(chatResponse);
  } catch (err: any) {
    console.error('Error during chat processing:', err?.message);
    res.status(500).json({
      error: 'Chat Processing Error',
      message: 'Failed to process assistant conversation.'
    });
  }
};
