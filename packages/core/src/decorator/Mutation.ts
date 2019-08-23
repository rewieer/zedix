import MetadataCollector, { Metadata } from "../core/MetadataCollector";

export type MutationMetadata = Metadata<
  "mutation",
  {
    name: string;
  }
>;

/**
 * Represent a GraphQL mutation
 * @param name
 * @constructor
 */
export default function Mutation(name: string) {
  return function(instance, method) {
    MetadataCollector.add<MutationMetadata>({
      type: "mutation",
      class: instance.constructor,
      methodName: method,
      name
    });
  };
}
