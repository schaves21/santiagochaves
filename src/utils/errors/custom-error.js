export class CustomError extends Error {
  constructor(code, name, cause, message) {
    super(message);
    this.code = code;
    this.name = name;
    this.cause = cause;
    this.message = message;
  }
}
