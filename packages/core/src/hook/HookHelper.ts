import MetadataCollector from "../core/MetadataCollector";
import { UnionMetadata } from "../decorator/decoratorTypes";
import Request from "../core/Request";

/**
 * @class HookHelper
 * Provide helper tools to deal with hooks
 */
class HookHelper {

  /**
   * Pass through the hooks corresponding to the
   * @param type the type of hook to pass through. Currently only "request" is supported.
   * @param instance the object (the instance of a controller at this time)
   * @param methodName the method that is being called
   * @param request the current HTTP request
   */
  passThrough<TData = any>(
    type: string,
    instance: any,
    methodName: string,
    request: Request<TData>
  ) {
    const allMetadata = MetadataCollector.getMetadataForObject(
      instance
    ) as UnionMetadata[];

    for (let metadata of allMetadata) {
      if (
        metadata.type === "hook" &&
        metadata.methodName === methodName &&
        metadata.config.type === type
      ) {
        metadata.config.action(request);
      }
    }
  }
}

export default new HookHelper();
