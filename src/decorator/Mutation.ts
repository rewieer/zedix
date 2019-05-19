import MetadataCollector from "../core/MetadataCollector";

/**
 * Represent a GraphQL mutation
 * @param name
 * @constructor
 */
export default function Mutation(name: string) {
  return function(target, method) {
    MetadataCollector.add({
      type: "mutation",
      target: target.constructor,
      methodName: method,
      name
    });
  };
}
