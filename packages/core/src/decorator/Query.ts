import MetadataCollector from "../core/MetadataCollector";

/**
 * Represent a GraphQL Query
 * @param name
 * @constructor
 */
export default function Query(name: string) {
  return function(target, method) {
    MetadataCollector.add({
      type: "query",
      target: target.constructor,
      methodName: method,
      name
    });
  };
}
