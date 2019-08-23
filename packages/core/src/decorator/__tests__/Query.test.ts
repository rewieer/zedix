import "jest";

import MetadataCollector from "../../core/MetadataCollector";
import Query from "../Query";

beforeEach(() => {
  MetadataCollector.clear();
});

function DummyFunction() {}

it("should add the query to the metadata collector", () => {
  const dummyObj = new DummyFunction();

  Query("foo")(dummyObj, "fooMethod");
  expect(MetadataCollector.getMetadataForObject(dummyObj)).toEqual([
    {
      type: "query",
      class: DummyFunction,
      methodName: "fooMethod",
      name: "foo"
    }
  ]);
});
