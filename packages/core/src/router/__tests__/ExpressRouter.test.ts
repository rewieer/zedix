import * as express from "express";
import * as supertest from "supertest";
import * as bodyParser from "body-parser";

import ExpressRouter from "../ExpressRouter";

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

it("should GET a simple route", async () => {
  const app = express();
  const router = new ExpressRouter();

  const instance = {
    doAction: jest.fn(() => {
      return { name: "John Doe" };
    })
  };

  router.receiveMetadata(instance, [
    {
      name: "instance.doAction",
      type: "web",
      method: "get",
      path: "/foo/bar",
      methodName: "doAction",
      target: instance.doAction
    }
  ]);

  router.integrate(app, helpers);
  const result = await supertest(app).get("/foo/bar");

  // @ts-ignore
  expect(result.statusCode).toBe(200);
  expect(result.body).toEqual({ name: "John Doe" });
});

it("should handle GET path variables", async () => {
  const app = express();
  const router = new ExpressRouter();

  const instance = {
    doAction: jest.fn((id, flag) => {
      return { id, name: "John Doe", flag };
    })
  };

  router.receiveMetadata(instance, [
    {
      name: "instance.doAction",
      type: "web",
      method: "get",
      path: "/foo/:id/bar/:flag",
      methodName: "doAction",
      target: instance.doAction
    }
  ]);

  router.integrate(app, helpers);
  const result = await supertest(app).get("/foo/1/bar/test");

  // @ts-ignore
  expect(result.statusCode).toBe(200);
  expect(result.body).toEqual({ id: "1", name: "John Doe", flag: "test" });
});

it("should handle GET variables", async () => {
  const app = express();
  const router = new ExpressRouter();

  const instance = {
    doAction: jest.fn((id, params) => {
      return { id, name: "John Doe", count: params.count };
    })
  };

  router.receiveMetadata(instance, [
    {
      name: "instance.doAction",
      type: "web",
      method: "get",
      path: "/foo/:id",
      methodName: "doAction",
      target: instance.doAction
    }
  ]);

  router.integrate(app, helpers);
  const result = await supertest(app).get("/foo/1?count=10");

  // @ts-ignore
  expect(result.statusCode).toBe(200);
  expect(result.body).toEqual({ id: "1", name: "John Doe", count: "10" });
});

it("should provide the locals", async () => {
  const app = express();
  app.use((req, res, next) => {
    res.locals.app = "This is a test app";
    next();
  });

  const router = new ExpressRouter();

  const instance = {
    doAction: jest.fn((data, app) => {
      expect(data).toEqual({});
      expect(app).toEqual("This is a test app");
      return { name: "John Doe" };
    })
  };

  router.receiveMetadata(instance, [
    {
      name: "instance.doAction",
      type: "web",
      method: "get",
      path: "/foo/bar",
      methodName: "doAction",
      target: instance.doAction
    }
  ]);

  router.integrate(app, helpers);
  const result = await supertest(app).get("/foo/bar");

  // @ts-ignore
  expect(result.statusCode).toBe(200);
  expect(result.body).toEqual({ name: "John Doe" });
});

it("POST should provide data from the body", async () => {
  const app = express();
  app.use(bodyParser.json());

  const router = new ExpressRouter();

  const instance = {
    doAction: jest.fn(data => {
      return data;
    })
  };

  router.receiveMetadata(instance, [
    {
      name: "instance.doAction",
      type: "web",
      method: "post",
      path: "/foo/bar",
      methodName: "doAction",
      target: instance.doAction
    }
  ]);

  router.integrate(app, helpers);
  const result = await supertest(app)
    .post("/foo/bar")
    .send({ name: "John Doe" });

  // @ts-ignore
  expect(result.statusCode).toBe(200);
  expect(result.body).toEqual({ name: "John Doe" });
});
