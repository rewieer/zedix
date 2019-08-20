import MetadataCollector, { Metadata } from "../core/MetadataCollector";

export type WebMetadata = Metadata<"web", {
  name: string;
  path: string;
  method: string;
  raw?: boolean;
}>

/**
 * Represent a Web Query
 * @param params
 * @constructor
 */
export default function Web(params: {
  name: string;
  path: string;
  method: string;
  raw?: boolean;
}) {
  return function(target, method) {
    MetadataCollector.add<WebMetadata>({
      type: "web",
      target: target.constructor,
      methodName: method,
      name: params.name,
      path: params.path,
      method: params.method,
      raw: params.raw
    });
  };
}
