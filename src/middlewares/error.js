import { CustomError } from '../utils/errors/custom-error.js';

export class errorHandler {
  static handleMiddleware(err, req, res, next) {
    if (err instanceof CustomError) {
      return res.status(err.statusCode).json({
        name: err.name,
        cause: err.cause,
        message: err.message,
      });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
