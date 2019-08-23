import { FieldMetadata } from "./Field";
import { WebMetadata } from "./Web";
import { QueryMetadata } from "./Query";
import { MutationMetadata } from "./Mutation";
import { HookMetadata } from "./Hook";

export type UnionMetadata =
  | FieldMetadata
  | WebMetadata
  | QueryMetadata
  | MutationMetadata
  | HookMetadata;
