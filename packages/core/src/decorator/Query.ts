import MetadataCollector, {Metadata} from "../core/MetadataCollector";

export type QueryMetadata = Metadata<"query", {
  name: string
}>

/**
 * Represent a GraphQL Query
 * @param name
 * @constructor
 */
export default function Query(name: string) {
  return function(target, method) {
    MetadataCollector.add<QueryMetadata>({
      type: "query",
      target: target.constructor,
      methodName: method,
      name
    });
  };
}
