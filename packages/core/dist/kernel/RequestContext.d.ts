/**
 * @class RequestContext
 * represent the context of an HTTP request
 */
declare class RequestContext {
    private data;
    set(name: string, value: any): void;
    get(name: string): any;
    has(name: string): boolean;
}
export default RequestContext;
