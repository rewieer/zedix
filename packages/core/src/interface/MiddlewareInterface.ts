import * as express from "express";
import RequestContext from "../core/RequestContext";

export type MiddlewareNext = express.NextFunction;
export type MiddlewareRequest = express.Request;

/**
 * @interface MiddlewareInterface
 * Represent an express middleware.
 */
interface MiddlewareInterface {
  /**
   * Handle the request.
   * @param req
   * @param context
   * @param next
   */
  handle(req: MiddlewareRequest, context: RequestContext, next: MiddlewareNext);
}

export default MiddlewareInterface;
