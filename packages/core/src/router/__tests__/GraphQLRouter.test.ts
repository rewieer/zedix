import * as express from "express";
import * as supertest from "supertest";
import * as path from "path";

import GraphQLRouter from "../GraphQLRouter";

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

const schemaPath = path.resolve(__dirname, "../../testUtils/schema");
describe("Queries, Mutations and Fields", () => {
  it("Should handle a query and return a response", async () => {
    const app = express();
    const router = new GraphQLRouter({
      schemaPath
    });

    function Controller() {
      this.doAction = jest.fn(({ data }) => {
        expect(data).toEqual({ id: "1" });
        return {
          id: 1,
          name: "rewieer"
        };
      });
    }

    router.$receiveMetadata(new Controller(), [
      {
        name: "author",
        type: "query",
        methodName: "doAction",
        class: Controller
      }
    ]);

    router.$integrate(app, helpers);
    const result = await supertest(app)
      .post("/graphql")
      .send({
        query: `
        query {
          author(id: 1) {
            id
            name
          }
        }
    `
      });

    // @ts-ignore
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({
      data: {
        author: {
          id: "1",
          name: "rewieer"
        }
      }
    });
  });
  it("Should handle a mutation and return a response", async () => {
    const app = express();
    const router = new GraphQLRouter({
      schemaPath
    });

    function Controller() {
      this.doAction = jest.fn(({ data }) => {
        expect(data).toEqual({ id: "1", name: "john doe" });
        return {
          id: 1,
          name: "john doe"
        };
      });
    }

    router.$receiveMetadata(new Controller(), [
      {
        name: "updateAuthor",
        type: "mutation",
        methodName: "doAction",
        class: Controller
      }
    ]);

    router.$integrate(app, helpers);
    const result = await supertest(app)
      .post("/graphql")
      .send({
        query: `
        mutation {
          updateAuthor(id: 1, name: "john doe") {
            id
            name
          }
        }
    `
      });

    // @ts-ignore
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({
      data: {
        updateAuthor: {
          id: "1",
          name: "john doe"
        }
      }
    });
  });
  it("Should handle a field and return a response", async () => {
    const app = express();
    const router = new GraphQLRouter({
      schemaPath
    });

    function Controller() {
      this.authorQuery = jest.fn(({ data }) => {
        expect(data).toEqual({ id: "1" });
        return {
          id: 1,
          name: "rewieer"
        };
      });

      this.authorNameField = jest.fn(({ parent }) => {
        expect(parent).toEqual({ id: 1, name: "rewieer" });
        return "john doe";
      });
    }

    router.$receiveMetadata(new Controller(), [
      {
        name: "author",
        type: "query",
        methodName: "authorQuery",
        class: Controller
      },
      {
        entity: "Author",
        field: "name",
        type: "field",
        methodName: "authorNameField",
        class: Controller
      }
    ]);

    router.$integrate(app, helpers);
    const result = await supertest(app)
      .post("/graphql")
      .send({
        query: `
        query {
          author(id: 1) {
            id
            name
          }
        }
    `
      });

    // @ts-ignore
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({
      data: {
        author: {
          id: "1",
          name: "john doe"
        }
      }
    });
  });
});
