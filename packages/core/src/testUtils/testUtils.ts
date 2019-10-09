import MetadataCollector from "../core/MetadataCollector";
import Request from "../core/Request";
import RouterInterface from "../interface/RouterInterface";

export const addRequestHook = (
  fn: (request: Request) => any,
  klass: any,
  methodName = "doAction"
) => {
  const hook = jest.fn(fn);

  MetadataCollector.add({
    type: "hook" as any,
    methodName: methodName,
    class: klass,
    config: {
      action: hook,
      type: "request"
    }
  });
};

export const addQueryToRouter = (
  router: RouterInterface,
  controller: any,
  queryName: string,
  methodName = "doAction",
) => {
  router.$receiveMetadata(controller, [
    {
      name: queryName,
      type: "query",
      methodName: methodName,
      class: controller.constructor
    }
  ])
};
export const addMutationToRouter = (
  router: RouterInterface,
  controller: any,
  mutationName: string,
  methodName = "doAction",
) => {
  router.$receiveMetadata(controller, [
    {
      name: mutationName,
      type: "mutation",
      methodName: methodName,
      class: controller.constructor
    }
  ])
};

export const createController = (
  action: (request: Request) => any,
  methodName = "doAction",
) => {
  function Controller() {
    this[methodName] = jest.fn(action);
  }

  return Controller;
};

type ComplexController = {
  type: string
  name?: string
  entity?: string
  field?: string
  callback: (request: any) => any,
  hooks?: Array<{
    type: "request",
    callback: (request: any) => any
  }>
}
export const createComplexControllerWithMetadata = (
  actions: Record<string, ComplexController>,
  router: RouterInterface,
) => {
  function Controller() {
    for (let key in actions) {
      if (actions.hasOwnProperty(key)) {
        this[key] = jest.fn(actions[key].callback);
      }
    }
  }

  const metadata = [];
  for (let methodName in actions) {
    if (actions.hasOwnProperty(methodName)) {
      const action = actions[methodName];
      if (action.type === "field") {
        metadata.push({
          entity: action.entity,
          field: action.field!,
          type: "field",
          methodName,
          class: Controller
        })
      } else if (action.type === "query" || action.type === "mutation") {
        metadata.push(      {
          name: action.name,
          type: action.type,
          methodName,
          class: Controller
        })
      } else {
        // It's web
        console.error("Not implemented");
      }

      if (action.hooks) {
        for (let hook of action.hooks) {
          addRequestHook(hook.callback, Controller, methodName);
        }
      }
    }
  }

  const controller = new Controller();
  router.$receiveMetadata(controller, metadata);
  return controller;
};
