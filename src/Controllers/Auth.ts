import { Request, Response, NextFunction } from 'express';
import { APIError } from '../Middlewares/Error';

export class Auth {
  signup(request: Request, response: Response, next: NextFunction) {
    const { email } = request.body;

    // Testing global error handlers
    if (!email) {
      next(APIError.badRequest('All fields are required'));
      return;
    }
    return response.status(201).json({ msg: 'cREATED' });
  }
}
