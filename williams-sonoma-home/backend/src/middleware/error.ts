import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  if (err.message === 'Validation failed') {
    return res.status(400).json({ error: err.details || 'Validation failed' });
  }

  if (err.status === 400 || err.statusCode === 400) {
    return res.status(400).json({ error: err.message });
  }

  if (err.status === 404 || err.statusCode === 404) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.status(500).json({ error: 'Internal server error' });
};
