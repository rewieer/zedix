import MetadataCollector, { Metadata } from "../core/MetadataCollector";

export type QueryMetadata = Metadata<
  "query",
  {
    name: string;
  }
>;

/**
 * Represent a GraphQL Query
 * @param name
 * @constructor
 */
export default function Query(name: string) {
  return function(instance, method) {
    MetadataCollector.add<QueryMetadata>({
      type: "query",
      class: instance.constructor,
      methodName: method,
      name
    });
  };
}
