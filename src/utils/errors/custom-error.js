export class CustomError extends Error {
  constructor(statusCode, name, cause, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = name;
    this.cause = cause;
    this.message = message;
  }
}
