import "jest";

import MetadataCollector from "../../core/MetadataCollector";
import Mutation from "../Mutation";

beforeEach(() => {
  MetadataCollector.clear();
});

function DummyFunction() {}

it("should add the mutation to the metadata collector", () => {
  const dummyObj = new DummyFunction();

  Mutation("foo")(dummyObj, "fooMethod");
  expect(MetadataCollector.getMetadataForObject(dummyObj)).toEqual([
    {
      type: "mutation",
      class: DummyFunction,
      methodName: "fooMethod",
      name: "foo"
    }
  ]);
});
