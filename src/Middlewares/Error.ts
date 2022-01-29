export class APIError {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    this.status = status;
    this.message = message;
  }

  static badRequest(message: string) {
    return new APIError(400, message);
  }

  static notFound(message: string) {
    return new APIError(404, message);
  }

  static internalError(message: string) {
    return new APIError(500, message);
  }

  static forbidden(message: string) {
    return new APIError(403, message);
  }

  static conflict(code: string, detail: string) {
    if (detail.includes('email') && code === '23505') {
      return new APIError(409, 'Account with this email already exist');
    }
    return new APIError(409, 'Unknown conflict occured');
  }

  static unAuthorized(message: string) {
    return new APIError(401, message);
  }
}
