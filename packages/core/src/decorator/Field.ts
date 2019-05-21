import MetadataCollector from "../core/MetadataCollector";

/**
 * Represent a GraphQL Query
 * @param entity
 * @param field
 * @constructor
 */
export default function Field(entity: string, field: string) {
  return function(target, method) {
    MetadataCollector.add({
      type: "field",
      target: target.constructor,
      methodName: method,
      entity,
      field
    });
  };
}
