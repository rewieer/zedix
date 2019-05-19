/**
 * @class RequestContext
 * represent the context of an HTTP request
 */
class RequestContext {
  private data = {};

  set(name: string, value: any) {
    this.data[name] = value;
  }

  get(name: string) {
    return this.data[name];
  }

  has(name: string): boolean {
    return this.data[name] !== undefined;
  }
}

export default RequestContext;
