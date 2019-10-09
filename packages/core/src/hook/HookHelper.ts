import MetadataCollector from "../core/MetadataCollector";
import { UnionMetadata } from "../decorator/decoratorTypes";
import Request from "../core/Request";

class HookHelper {
  passThrough<TData = any>(
    type: string,
    object: any,
    methodName: string,
    request: Request<TData>
  ) {
    const allMetadata = MetadataCollector.getMetadataForObject(
      object
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
