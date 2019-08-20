import MetadataCollector, {Metadata} from "../core/MetadataCollector";

export type MutationMetadata = Metadata<"mutation", {
  name: string
}>

/**
 * Represent a GraphQL mutation
 * @param name
 * @constructor
 */
export default function Mutation(name: string) {
  return function(target, method) {
    MetadataCollector.add<MutationMetadata>({
      type: "mutation",
      target: target.constructor,
      methodName: method,
      name
    });
  };
}
