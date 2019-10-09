import MetadataCollector, { Metadata } from "../core/MetadataCollector";
import Request from "../core/Request";

export type HookConfig<TData = any> = {
  type: string;
  action: (request: Request<TData>, event?: any) => any;
};

export type HookMetadata<TData = any> = Metadata<
  "hook",
  {
    config: HookConfig<TData>;
  }
>;

const mySymbol = Symbol("__classID__");

export default function Hook(config: HookConfig) {
  return function(instance, method) {
    MetadataCollector.add<HookMetadata>({
      type: "hook",
      class: instance.constructor,
      methodName: method,
      config
    });
  };
}
