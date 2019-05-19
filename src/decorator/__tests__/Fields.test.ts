import "jest";

import MetadataCollector from "../../core/MetadataCollector";
import Field from "../Field";

beforeEach(() => {
  MetadataCollector.clear();
});

function DummyFunction() {}

it("should add the field to the metadata collector", () => {
  const dummyObj = new DummyFunction();

  Field("User", "getName")(dummyObj, "fooMethod");
  expect(MetadataCollector.getMetadataForObject(dummyObj)).toEqual([
    {
      type: "field",
      target: DummyFunction,
      methodName: "fooMethod",
      entity: "User",
      field: "getName"
    }
  ]);
});
