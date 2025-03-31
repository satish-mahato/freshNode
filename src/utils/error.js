export default class UserError extends Error {
  constructor(message) {
    super(message);
    this.name = "UserError";
  }
}
export class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
  }
}