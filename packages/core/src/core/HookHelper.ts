import MetadataCollector from "./MetadataCollector";
import {UnionMetadata} from "../decorator/decoratorTypes";

class HookHelper {
  passThrough<TData = any>(name: string, object: any, methodName: string, data: TData) {
    const allMetadata = MetadataCollector.getMetadataForObject(object) as UnionMetadata[];
    for (let metadata of allMetadata) {
      if (metadata.type === "hook" && metadata.methodName === methodName && metadata.config.name === name) {
        const fromHookData = metadata.config.action(data);
        if (typeof fromHookData !== "undefined") {
          data = fromHookData;
        }
      }
    }

    return data;
  }
}

export default new HookHelper();
