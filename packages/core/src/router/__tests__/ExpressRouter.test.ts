import * as express from "express";
import * as supertest from "supertest";
import * as bodyParser from "body-parser";

import ExpressRouter from "../ExpressRouter";
import { UnionMetadata } from "../../decorator/decoratorTypes";
import RequestContext from "../../core/RequestContext";
import MetadataCollector from "../../core/MetadataCollector";

const helpers = {
  getLogger: () => {
    return {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    };
  },
  getURL: () => "https://site.com"
};

describe("HTTP Requests", () => {
  it("should GET a simple route", async () => {
    const app = express();
    const router = new ExpressRouter();

    function Controller() {
      this.doAction = jest.fn(() => {
        return { name: "John Doe" };
      });
    }

    router.$receiveMetadata(new Controller(), [
      {
        name: "instance.doAction",
        type: "web",
        method: "get",
        path: "/foo/bar",
        methodName: "doAction",
        class: Controller
      }
    ]);

    router.$integrate(app, helpers);
    const result = await supertest(app).get("/foo/bar");

    // @ts-ignore
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({ name: "John Doe" });
  });
  it("should handle GET route variables", async () => {
    const app = express();
    const router = new ExpressRouter();

    function Controller() {
      this.doAction = jest.fn(({ meta }) => {
        expect(meta.routeParams).toEqual({
          id: "1",
          flag: "test"
        });

        return { done: true };
      });
    }

    router.$receiveMetadata(new Controller(), [
      {
        name: "instance.doAction",
        type: "web",
        method: "get",
        path: "/foo/:id/bar/:flag",
        methodName: "doAction",
        class: Controller
      }
    ]);

    router.$integrate(app, helpers);
    const result = await supertest(app).get("/foo/1/bar/test");

    // @ts-ignore
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({ done: true });
  });
  it("should handle GET variables and route variables", async () => {
    const app = express();
    const router = new ExpressRouter();

    function Controller() {
      this.doAction = jest.fn(({ data, meta }) => {
        expect(data).toEqual({
          count: "10"
        });
        expect(meta.routeParams).toEqual({
          id: "1"
        });

        return { done: true };
      });
    }

    router.$receiveMetadata(new Controller(), [
      {
        name: "instance.doAction",
        type: "web",
        method: "get",
        path: "/foo/:id",
        methodName: "doAction",
        class: Controller
      }
    ]);

    router.$integrate(app, helpers);
    const result = await supertest(app).get("/foo/1?count=10");

    // @ts-ignore
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({ done: true });
  });
  it("should pass context through locals", async () => {
    const app = express();

    app.use((req, res, next) => {
      const context = new RequestContext();
      context.set("foo", "bar");
      res.locals.context = context;
      next();
    });

    const router = new ExpressRouter();

    function Controller() {
      this.doAction = jest.fn(({ data, request, context }) => {
        expect(data).toEqual({});
        expect(context.get("foo")).toEqual("bar");
        return { done: true };
      });
    }

    router.$receiveMetadata(new Controller(), [
      {
        name: "instance.doAction",
        type: "web",
        method: "get",
        path: "/foo/bar",
        methodName: "doAction",
        class: Controller
      }
    ]);

    router.$integrate(app, helpers);
    const result = await supertest(app).get("/foo/bar");

    // @ts-ignore
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({ done: true });
  });
  it("POST should provide data from the body", async () => {
    const app = express();
    app.use(bodyParser.json());

    const router = new ExpressRouter();

    function Controller() {
      this.doAction = jest.fn(({ data }) => {
        expect(data).toEqual({ name: "John Doe" });
        return { done: true };
      });
    }

    router.$receiveMetadata(new Controller(), [
      {
        name: "instance.doAction",
        type: "web",
        method: "post",
        path: "/foo/bar",
        methodName: "doAction",
        class: Controller
      }
    ]);

    router.$integrate(app, helpers);
    const result = await supertest(app)
      .post("/foo/bar")
      .send({ name: "John Doe" });

    // @ts-ignore
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({ done: true });
  });
});

describe("Hooks", () => {
  it("Should call the hook", async () => {
    const app = express();
    const router = new ExpressRouter();

    function Controller() {
      this.doAction = jest.fn(() => {
        return { name: "John Doe" };
      });
    }

    const hook = jest.fn(request => {
      expect(request.getData()).toEqual({ user: 1 });
    });

    MetadataCollector.add({
      type: "hook" as any,
      methodName: "doAction",
      class: Controller,
      config: {
        action: hook,
        name: "request"
      }
    });

    router.$receiveMetadata(new Controller(), [
      {
        name: "instance.doAction",
        type: "web" as any,
        method: "post",
        path: "/foo/bar",
        methodName: "doAction",
        class: Controller
      }
    ]);

    router.$integrate(app, helpers);
    const result = await supertest(app)
      .post("/foo/bar")
      .send({ user: 1 });

    // @ts-ignore
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({ name: "John Doe" });
    expect(hook).toHaveBeenCalled();
  });
});

describe("CORS", () => {
  function Controller() {
    this.doAction = jest.fn(() => {
      return { name: "John Doe" };
    });
  }

  const sampleRoute: UnionMetadata[] = [
    {
      name: "instance.doAction",
      type: "web",
      method: "get",
      path: "/foo/bar",
      methodName: "doAction",
      class: Controller
    }
  ];

  it("should return default CORS headers", async () => {
    const app = express();
    const router = new ExpressRouter();
    router.$receiveMetadata(new Controller(), sampleRoute);
    router.$integrate(app, helpers);
    const result = await supertest(app).get("/foo/bar");

    // @ts-ignore
    expect(result.header["access-control-allow-origin"]).toEqual("*");
  });
  it("should allow a specific website", async () => {
    const app = express();
    const router = new ExpressRouter({
      cors: {
        origin: "https://authorizedwebsite.com"
      }
    });

    router.$receiveMetadata(new Controller(), sampleRoute);
    router.$integrate(app, helpers);
    const result = await supertest(app).get("/foo/bar");

    expect(result.header["access-control-allow-origin"]).toEqual(
      "https://authorizedwebsite.com"
    );
  });
});
