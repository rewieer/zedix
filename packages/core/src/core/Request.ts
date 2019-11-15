import * as express from "express";
import RequestContext from "./RequestContext";

class Request<TData = any, TMeta = any, TResponse = any> {
  public data: TData; // Actual data received from the request
  public meta: TMeta; // Any additional data provided by routers, hooks...
  public context: RequestContext; // Contextual data about the request
  public request: express.Request; // Original request
  public response: TResponse; // Original response

  constructor(request: express.Request, response: express.Response) {
    this.request = request;
    this.context = response.locals.context || new RequestContext();
  }

  setData(data: TData) {
    this.data = data;
  }

  getData() {
    return this.data;
  }

  setMeta(meta: TMeta) {
    this.meta = meta;
  }

  getMeta() {
    return this.meta;
  }

  getContext(): RequestContext {
    return this.context;
  }

  setContext(context: RequestContext) {
    this.context = context;
  }

  getRequest() {
    return this.request;
  }

  getResponse() {
    return this.response;
  }

  setResponse(response: TResponse) {
    this.response = response;
  }

}

export default Request;
