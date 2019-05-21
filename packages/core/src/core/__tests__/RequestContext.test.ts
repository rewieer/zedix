import RequestContext from "../RequestContext";

it("should get undefined value", () => {
  const context = new RequestContext();
  expect(context.get("test")).toBe(undefined);
});

it("should set value", () => {
  const context = new RequestContext();
  context.set("test", "Hello World");
  expect(context.get("test")).toBe("Hello World");
});

it("should check if the value is contained", () => {
  const context = new RequestContext();

  expect(context.has("test")).toBe(false);
  context.set("test", "Hello World");
  expect(context.has("test")).toBe(true);
});
