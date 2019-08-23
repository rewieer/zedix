import "jest";

import MetadataCollector from "../../core/MetadataCollector";
import Web from "../Web";

beforeEach(() => {
  MetadataCollector.clear();
});

function DummyFunction() {}

it.only("should add the query to the metadata collector", () => {
  const dummyObj = new DummyFunction();

  Web({
    name: "createUser",
    path: "/foo/bar",
    method: "GET"
  })(dummyObj, "fooMethod");
  expect(MetadataCollector.getMetadataForObject(dummyObj)).toEqual([
    {
      type: "web",
      class: DummyFunction,
      methodName: "fooMethod",
      path: "/foo/bar",
      name: "createUser",
      method: "GET",
      raw: false
    }
  ]);
});
