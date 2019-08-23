import MetadataCollector from "../core/MetadataCollector";
import { UnionMetadata } from "../decorator/decoratorTypes";
import Request from "../core/Request";

class HookHelper {
  passThrough<TData = any>(
    name: string,
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
        metadata.config.name === name
      ) {
        metadata.config.action(request);
      }
    }
  }
}

export default new HookHelper();
