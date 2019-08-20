import MetadataCollector, {Metadata} from "../core/MetadataCollector";

export type FieldMetadata = Metadata<"field", {
  entity: string
  field: string
}>

/**
 * Represent a GraphQL Query
 * @param entity
 * @param field
 * @constructor
 */
export default function Field(entity: string, field: string) {
  return function(target, method) {
    MetadataCollector.add<FieldMetadata>({
      type: "field",
      target: target.constructor,
      methodName: method,
      entity,
      field
    });
  };
}
