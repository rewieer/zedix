import { AppClass } from "../App";
import createTestLogger from "../../testUtils/createTestLogger";
import BaseService from "../../service/BaseService";
import * as supertest from "supertest";
import ExpressRouter from "../../router/ExpressRouter";
import ControllerInterface from "../../interface/ControllerInterface";
import MiddlewareInterface from "../../interface/MiddlewareInterface";
import RequestContext from "../RequestContext";
import Web from "../../decorator/Web";
import Hook from "../../decorator/Hook";

describe("App", () => {
  it("should create an app", () => {
    const logger = createTestLogger();
    const app = new AppClass();
    app.configure({
      logger,
      controllers: [],
      routers: [],
      middlewares: [],
      services: []
    });
  });
});
describe("Controller", () => {
  describe("Web", () => {
    it("Should call the web controller", async () => {
      class MyCtrl implements ControllerInterface {
        @Web({ name: "myWebController", path: "/foo/bar", method: "GET" })
        getBar() {
          return {
            foo: "bar"
          };
        }
      }

      const logger = createTestLogger();
      const app = new AppClass();
      app.configure({
        logger,
        controllers: [new MyCtrl()],
        routers: [new ExpressRouter()],
        middlewares: [],
        services: []
      });

      const result = await supertest(app.server).get("/foo/bar");
      expect(result.body).toEqual({ foo: "bar" });
    });
    it("Should pass data", async () => {
      class MyCtrl implements ControllerInterface {
        @Web({ name: "myWebController", path: "/foo/bar", method: "POST" })
        getBar({ data, meta }) {
          expect(data).toEqual({ user: 1 });
          expect(meta).toEqual({ routeParams: null });
          return {
            done: true
          };
        }
      }

      const logger = createTestLogger();
      const app = new AppClass();
      app.configure({
        logger,
        controllers: [new MyCtrl()],
        routers: [new ExpressRouter()],
        middlewares: [],
        services: []
      });

      const result = await supertest(app.server)
        .post("/foo/bar")
        .send({ user: 1 });
      expect(result.body).toEqual({ done: true });
    });
    it("Should pass query params", async () => {
      class MyCtrl implements ControllerInterface {
        @Web({ name: "myWebController", path: "/foo/bar", method: "GET" })
        getBar({ data, meta }) {
          expect(data).toEqual({
            a: "1",
            b: "2"
          });
          expect(meta).toEqual({
            routeParams: null
          });

          return {
            done: true
          };
        }
      }

      const logger = createTestLogger();
      const app = new AppClass();
      app.configure({
        logger,
        controllers: [new MyCtrl()],
        routers: [new ExpressRouter()],
        middlewares: [],
        services: []
      });

      const result = await supertest(app.server).get("/foo/bar?a=1&b=2");
      expect(result.body).toEqual({ done: true });
    });
    it("Should pass route params", async () => {
      class MyCtrl implements ControllerInterface {
        @Web({
          name: "myWebController",
          path: "/foo/bar/:id/:page",
          method: "GET"
        })
        getBar({ data, meta }) {
          expect(data).toEqual({});
          expect(meta).toEqual({
            routeParams: {
              id: "1",
              page: "sometest"
            }
          });

          return {
            done: true
          };
        }
      }

      const logger = createTestLogger();
      const app = new AppClass();
      app.configure({
        logger,
        controllers: [new MyCtrl()],
        routers: [new ExpressRouter()],
        middlewares: [],
        services: []
      });

      const result = await supertest(app.server).get("/foo/bar/1/sometest");
      expect(result.body).toEqual({ done: true });
    });
  });
  describe("Hook", () => {
    it("Should call the hook", async () => {
      const hook = jest.fn(obj => {
        expect(obj.getData()).toEqual({ user: 1 });
      });

      class MyCtrl implements ControllerInterface {
        @Hook({ type: "request", action: hook })
        @Web({ name: "myWebController", path: "/foo/bar", method: "POST" })
        getBar() {
          return {
            done: true
          };
        }
      }

      const app = new AppClass();
      app.configure({
        logger: createTestLogger(),
        controllers: [new MyCtrl()],
        routers: [new ExpressRouter()],
        middlewares: [],
        services: []
      });

      const result = await supertest(app.server)
        .post("/foo/bar")
        .send({ user: 1 });
      expect(result.body).toEqual({ done: true });
      expect(hook).toHaveBeenCalled();
    });
    it("Should call the hook and update data", async () => {
      const hook = jest.fn(request => {
        expect(request.getData()).toEqual({ user: 1 });
        request.setData({ user: 2 });
      });

      class MyCtrl implements ControllerInterface {
        @Hook({ type: "request", action: hook })
        @Web({ name: "myWebController", path: "/foo/bar", method: "POST" })
        getBar({ data }) {
          return data;
        }
      }

      const app = new AppClass();
      app.configure({
        logger: createTestLogger(),
        controllers: [new MyCtrl()],
        routers: [new ExpressRouter()],
        middlewares: [],
        services: []
      });

      const result = await supertest(app.server)
        .post("/foo/bar")
        .send({ user: 1 });
      
      expect(result.body).toEqual({ user: 2 });
    });
    it("Should call the hooks in order and update data", async () => {
      const hookA = jest.fn(request => {
        expect(request.getData()).toEqual({ user: 1 });
        request.setData({ user: 2 });
      });
      const hookB = jest.fn(request => {
        expect(request.getData()).toEqual({ user: 2 });
        request.setData({ user: 3 });
      });
      const hookC = jest.fn(request => {
        expect(request.getData()).toEqual({ user: 3 });
        request.setData({ user: 5 });
      });

      class MyCtrl implements ControllerInterface {
        @Hook({ type: "request", action: hookA })
        @Hook({ type: "request", action: hookB })
        @Hook({ type: "request", action: hookC })
        @Web({ name: "myWebController", path: "/foo/bar", method: "POST" })
        getBar({ data }) {
          return data;
        }
      }

      const app = new AppClass();
      app.configure({
        logger: createTestLogger(),
        controllers: [new MyCtrl()],
        routers: [new ExpressRouter()],
        middlewares: [],
        services: []
      });

      const result = await supertest(app.server)
        .post("/foo/bar")
        .send({ user: 1 });
      expect(result.body).toEqual({ user: 5 });
    });
  });
});

describe("Services", () => {
  it("should instantiate and configure the service", () => {
    class DummyService extends BaseService {
      $getName(): string {
        return "MyDummyService";
      }
    }

    const logger = createTestLogger();
    const app = new AppClass();
    app.configure({
      logger,
      controllers: [],
      routers: [],
      middlewares: [],
      services: [DummyService]
    });

    expect(app.getService("MyDummyService")).toBeInstanceOf(DummyService);
  });
  it("should initialize and integrate the service", async () => {
    class DummyService extends BaseService {
      $getName(): string {
        return "MyDummyService";
      }
      $initialize = jest.fn();
      $integrate = jest.fn(expressApp => {
        expect(expressApp).toEqual(app.server);
      });
    }

    const logger = createTestLogger();
    const app = new AppClass();
    await app.configure({
      logger,
      controllers: [],
      routers: [],
      middlewares: [],
      services: [DummyService]
    });

    expect(app.getService("MyDummyService")).toBeInstanceOf(DummyService);
    expect(app.getService("MyDummyService").$initialize).toHaveBeenCalled();
    expect(app.getService("MyDummyService").$integrate).toHaveBeenCalled();
  });
});

describe("Middlewares", () => {
  it("should add the middleware and pass context", async () => {
    const middleware: MiddlewareInterface = {
      handle: jest.fn((req, context, next) => {
        expect(context).toBeInstanceOf(RequestContext);
        expect(context).toEqual({ data: {} });
        next();
      })
    };

    const logger = createTestLogger();
    const app = new AppClass();
    app.configure({
      logger,
      controllers: [],
      routers: [],
      middlewares: [middleware],
      services: []
    });

    await supertest(app.server).get("/foo/bar");
    expect(middleware.handle).toHaveBeenCalled();
  });
  it("should add the middlewares in order and use context", async () => {
    const middlewareOne: MiddlewareInterface = {
      handle: jest.fn((req, context: RequestContext, next) => {
        context.set("foo", "bar");
        next();
      })
    };
    const middlewareTwo: MiddlewareInterface = {
      handle: jest.fn((req, context: RequestContext, next) => {
        expect(context.get("foo")).toBe("bar");
        next();
      })
    };

    const logger = createTestLogger();
    const app = new AppClass();
    app.configure({
      logger,
      controllers: [],
      routers: [],
      middlewares: [middlewareOne, middlewareTwo],
      services: []
    });

    await supertest(app.server).get("/foo/bar");
    expect(middlewareOne.handle).toHaveBeenCalled();
    expect(middlewareTwo.handle).toHaveBeenCalled();
  });
});
