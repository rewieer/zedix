import "jest";

import MetadataCollector from "../MetadataCollector";

beforeEach(() => {
  MetadataCollector.clear();
});

function DummyFunction() {}

it("should add the query to the metadata collector", () => {
  const dummyObj = new DummyFunction();
  MetadataCollector.add({
    type: "test",
    class: DummyFunction,
    methodName: "doX"
  });

  expect(MetadataCollector.getMetadataForObject(dummyObj)).toEqual([
    {
      type: "test",
      class: DummyFunction,
      methodName: "doX"
    }
  ]);
});
