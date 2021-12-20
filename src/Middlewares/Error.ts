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
}
