import MetadataCollector, {Metadata} from "../core/MetadataCollector";

export type HookConfig<TEventData extends object = {}, TInput extends object = {}> = {
  name: string,
  action: (input: TInput, event?: any) => any,
};

export type HookMetadata<TEventData extends object = {}, TInput extends object = {}> = Metadata<"hook", {
  config: HookConfig<TEventData, TInput>,
}>

export default function Hook(config : HookConfig) {
  return function(target, method) {
    MetadataCollector.add<HookMetadata>({
      type: "hook",
      target: target.constructor,
      methodName: method,
      config,
    });
  };
}
