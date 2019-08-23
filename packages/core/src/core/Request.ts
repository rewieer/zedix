import * as express from "express";
import RequestContext from "./RequestContext";

class Request<TData = any, TMeta = any> {
  private data: TData;
  private meta: TMeta;
  private context: RequestContext;
  private request: express.Request;
  private response: express.Response;

  constructor(request: express.Request, response: express.Response) {
    this.request = request;
    this.response = response;
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
}

export default Request;
