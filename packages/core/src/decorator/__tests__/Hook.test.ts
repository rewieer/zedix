import "jest";

import MetadataCollector from "../../core/MetadataCollector";
import Hook from "../Hook";

beforeEach(() => {
  MetadataCollector.clear();
});

function DummyFunction() {}

it("should add the field to the metadata collector", () => {
  const dummyObj = new DummyFunction();
  const action = jest.fn();

  Hook({
    name: "request",
    action
  })(dummyObj, "fooMethod");
  expect(MetadataCollector.getMetadataForObject(dummyObj)).toEqual([
    {
      type: "hook",
      class: DummyFunction,
      methodName: "fooMethod",
      config: {
        name: "request",
        action
      }
    }
  ]);
});
