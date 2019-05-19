import "jest";

import Authenticator from "../Authenticator";
import RequestContext from "../../core/RequestContext";

it("should authenticate the user", async () => {
  const context = new RequestContext();
  const dummyRequest = {
    foo: "bar"
  };

  const conf = {
    authenticate: jest.fn((req, ctx) => {
      expect(req).toEqual(dummyRequest);
      expect(ctx).toEqual(context);

      return {
        id: 1
      };
    }),
    getRoles: jest.fn()
  };

  const authenticator = new Authenticator(conf);
  const middleware = authenticator.toMiddleware();

  // @ts-ignore
  await middleware.handle(dummyRequest, context, jest.fn());
  expect(context.get("user")).toEqual({
    id: 1
  });
});

it("should not authenticate the user", async () => {
  const context = new RequestContext();
  const dummyRequest = {
    foo: "bar"
  };

  const conf = {
    authenticate: jest.fn(),
    getRoles: jest.fn()
  };

  const authenticator = new Authenticator(conf);
  const middleware = authenticator.toMiddleware();

  // @ts-ignore
  await middleware.handle(dummyRequest, context, jest.fn());
  expect(context.get("user")).toEqual(null);
});
