export default class UserError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "UserError";
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
export class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthenticationError";
  }
}
