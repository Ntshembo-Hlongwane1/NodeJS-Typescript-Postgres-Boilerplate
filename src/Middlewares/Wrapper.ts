import { Request, Response, NextFunction } from 'express';
import { APIError } from './Error';

export const wrapper = (error: APIError, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof APIError) {
    return response.status(error.status).json({ error: error.message });
  }

  return response.status(500).json({ error: 'Server cannot determine error, contact support' });
};
