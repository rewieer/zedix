import * as express from "express";
import RequestContext from "../core/RequestContext";
export declare type MiddlewareNext = express.NextFunction;
export declare type MiddlewareRequest = express.Request;
interface MiddlewareInterface {
    handle(req: MiddlewareRequest, context: RequestContext, next: MiddlewareNext): any;
}
export default MiddlewareInterface;
