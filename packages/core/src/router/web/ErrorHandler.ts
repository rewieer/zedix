import {Request, Response} from "express";
import {OrNull} from "../../types";

export class HTTPError extends Error {
  public code: number;
  public payload: OrNull<object>;

  constructor(message: string, code: number = 500, payload?: OrNull<object>) {
    super(message);
    this.code = code;
    this.payload = payload || null;
  }
}

export interface ErrorHandlerInterface {
  handle(err: Error, req: Request, res: Response): void | Promise<void>;
}

class ErrorHandler implements ErrorHandlerInterface {
  handle(err: Error, req: Request, res: Response) {
    res
      .status(500)
      .send(err instanceof HTTPError ? {
        message: err.message,
        code: err.code,
        payload: err.payload,
      } : {
        message: err.message,
        code: 500,
        payload: null,
      })
      .end();
  }
}

export default ErrorHandler;
