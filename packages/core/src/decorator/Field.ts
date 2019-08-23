import MetadataCollector, { Metadata } from "../core/MetadataCollector";

export type FieldMetadata = Metadata<
  "field",
  {
    entity: string;
    field: string;
  }
>;

/**
 * Represent a GraphQL Query
 * @param entity
 * @param field
 * @constructor
 */
export default function Field(entity: string, field: string) {
  return function(instance, method) {
    MetadataCollector.add<FieldMetadata>({
      type: "field",
      class: instance.constructor,
      methodName: method,
      entity,
      field
    });
  };
}
