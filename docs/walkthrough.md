# Walkthrough

## What's Zedix is going to bring to you
Frameworks are really great to get started quickly with a minimal setup, from which you can
work and focus on your product rather than spending the whole day configuring an HTTP server, logging,
bridging your GraphQL schemas and types, and establishing an architecture.

This is what Zedix aims to provides : a minimal setup containing an HTTP server powered by Express,
a GraphQL setup, and TypeORM as your ORM. It works with Typescript by default.

## Installation
Let's get started by installing the package globally.

`npm i -g zedix`

From this point, the CLI is installed and you can now create a new project.

`zedix init --name MyProject`

This will initialize a project named MyProject that will contain the skeleton for a zedix application.

## Anatomy
There are various entities composing a Zedix app. They're actually just a few of them, the rest is up to you !
Let's check some default code from `src/app.ts`

```ts
import App, { configurable, LoggerService, ORMService, MailerService, TemplatingService, ExpressRouter, GraphQLRouter } from "zedix";

import config from "../config/config";
import RootController from "./controller/RootController";

const createMailerConfig = config => {
  return [
    {
      host: config.parameters.SMTP_HOST,
      port: config.parameters.SMTP_PORT,
      secure: false,
      auth: config.parameters.SMTP_AUTH
    }
  ];
};

export default (env: "production" | "development" | "test") => {
  return App.configure({
    config: config,
    logger: new LoggerService({
      env: config.parameters.ENV,
      ...config.logger
    }),
    controllers: [
      new RootController(),
    ],
    services: [
      ORMService,
      configurable(MailerService, createMailerConfig),
      TemplatingService
    ],
    middlewares: [],
    routers: [
      new GraphQLRouter({
        schemaPath: __dirname + "/schema",
      }),
      new ExpressRouter({
        views: config.paths.views,
        public: config.paths.public
      })
    ]
  });
};
```

That's the entry point of your Zedix application. It's a function that takes an environment as a parameter and return an App.

The app is configured with the following elements :
* A config that you can find in `config/config.ts`.
* **Logger** : a logger that the whole app will use in order to handle logging. By default, Zedix comes packed with `winston`, a
powerful solution that logs into files, consoles, and can basically logs everywhere if you give it the transports.
* **Controller** : like every MVC application, the Controller is the core of your app. It's where you're going to put your business code. Most of your
time is going to be spent working with controllers.
* **Services** : a service is a class implementing the **Service Interface**. It's useful for elements that depends on the App lifecycle
and methods.
* **Middlewares** : a middleware is a class implementing the **Middleware Interface**. It's an Express middleware, basically.
You can see one at work in the [Authenticator](https://github.com/rewieer/zedix/blob/master/src/middleware/Authenticator.ts).
* **Router** : a router bridges your controller to the HTTP server. As you will soon see, you can use **Decorators** to create your various
GraphQL mutations, queries, fields and HTTP endpoints. By default, Zedix comes bundled with an ExpressRouter to handle Web Requests, and a
GraphQLRouter powered by Apollo to handle GraphQL requests.

Your folder structure is also important :

* **src/controller** contain all your controllers
* **src/orm/entity** contain your entities. By default, it contains a simple User.
* **src/orm/migrations** contains your TypeORM migrations
* **src/schema** contain your GraphQL schemas. **You can split it into multiple files !** By default, it only contains
a `root.ts` file with a root GraphQL Query.
* **src/typings** contain your TS typings.
* **var/logs** contain logs.

## Configuring
After installation, we're not ready yet to get started. Indeed, we have to create a parameters file. Copy the content of
`config/parameters.dist.ts` into `config/parameters.ts` and configure your database. If you have none, you can simply
remove the `ORMService` from `app.ts`.

Once your done, you can start by typing `npm run dev`. This will start the app at `localhost:4998`. As you can see, the
development runtime is also powered by Zedix which uses Nodemon under the hood so that you can test your code without reloading.
Neat !
`
## Adding a Query
Use your favorite GraphQL client (or go to `http://localhost:4998/graphql) and type the following query :
```
query {
  app
}
```

You will get the following response :
```
{
  "data": {
    "app": "Hello World!"
  }
}
```

Our GraphQL server is running ! This is our controller in action.

```ts 
import { ControllerInterface, Query } from "zedix";

class RootController implements ControllerInterface {
  @Query("app")
  async appQuery() {
    return "Hello World!";
  }
}

export default RootController;
```

The `GraphQLRouter` uses the `Query` decorator to link our function to GraphQL. But this would not
work if our schema wasn't defined into `src/schema/root.ts`. 

```ts
export default `
  type Query {
    app: String!
  }
`;
```

As you can see, our RootController `@Query("app")` is mapped to our default Query `app`.
Let's tweak this a little bit. Let's add a query to fetch a user.

First, let's replace the content of our `root.ts` by :

```
export default `
  type User {
    id: Int!
    name: String!
  }
  
  type Query {
    app: String!
    user: User!
  }
`;
```

Then, let's add a new query into our RootController :
```ts
@Query("user")
async getUser() {
  return {
    id: 1,
    name: "John Doe",
  }
}
```

You can now type the following query into your explorer :
```
query {
  user {
    id
    name
  }
}
```

Which will return :
``` 
{
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe"
    }
  }
}
```

## Adding a mutation
Now let's allow the user to create other users. Update `root.ts` by adding a `CreateUserInput` and a `Mutation` :
``` 
export default `
  ...
  
  input CreateUserInput {
    name: String!
  }
  
  type Query {
    ...
  }
  
  type Mutation {
    createUser(input: CreateUserInput): User
  }
`;
```

Now, import `Mutation` from `zedix` in `RootController` and add the following mutation :
```ts 
@Mutation("createUser")
async createUser(data) {
  return {
    id: 1,
    name: data.input.name,
  }
}
```

As you can see, whatever data is sent to us through the mutation can be accessed through the first argument. 
In our function, we return the name received from the user. You can check by typing the following query in your explorer :

```
mutation {
  createUser(input: {
    name: "John Doe !"
  }) {
    id
    name
  }
}
```

Which will output :
```
{
  "data": {
    "createUser": {
      "id": 1,
      "name": "John Doe !"
    }
  }
}
```

## Using the database
As a layer between our App and our DataSource lies an ORM : `TypeORM`. In order to communicate with our database, we are
going to use it.
The `ORMService` is part of the App. As such, it can be accessed by using `App.getService("ORM")`. Every service has a name from
which it can be accessed.

First, ensure your database connection is correctly configured in `parameters.ts`. Then, let's make our `src/orm/entity/User.ts` minimal. Put the following in it :
```ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
```

Let's now update our code to hit the database whenever we call the `createUser` mutation. 

```ts 
import App, { ControllerInterface, Query, Mutation } from "zedix"; // Include "App"
import { User } from "../orm/entity/User"; // Include the user

class RootController implements ControllerInterface {
  ... 
  @Mutation("createUser")
  async createUser(data) {
    const user = new User();
    user.name = data.input.name;

    await App.getService("ORM").getRepository(User).save(user);
    return user;
  }
}

export default RootController;
```

Great, let's try our mutation once again.
```
mutation {
  createUser(input: {
    name: "John Doe !"
  }) {
    id
    name
  }
}
```

And the output :
```
{
  "data": {
    "createUser": {
      "id": 1,
      "name": "John Doe !"
    }
  }
}
```

Great ! Check your database, you will see the user is correctly stored. 

## Fetching the user from a Query
Now that we've started using our database, we will update the `user` query so that it returns an actual user, matched by ID.
Let's update our `root` schema so that we can pass an ID to the query.
``` 
export default `
  ...
  type Query {
    ...
    user(id: Int!): User! // Set this
  }
  ...
`;
```

And let's update our Query to fetch our user from the passed ID.

```ts
...
@Query("user")
async getUser(data) {
  return App.getService("ORM").getRepository(User).findOne(data.id);
}
...
```

Whatever input provided by the user is available from the first parameter of our Query. We can access the ID 
from `data.id` and use our ORM to find a matching user.

```
query { 
  user(id: 1) {
    id
    name
  }
}
```

Output :
```
{
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe"
    }
  }
}
```

## Adding a custom field 
We can add a custom field to our object easily using the `Field` decorator. If you've ever worked with VueJS, you can
think of a Field as a computed property that is not part of the object itself but can be computed when required. It comes handy
if you have to talk to another API to get the data you need, while keeping your code clean.

As a very, very simple example, let's update our user representation in `root.ts` by adding an `isAdmin` property.
```
...
type User {
  id: Int!
  name: String!
  isAdmin: Boolean!
}
...
```

We can now add the field to our `RootController.ts` :

```ts 
import App, { ControllerInterface, Query, Mutation, Field } from "zedix"; // Add Field
import {User} from "../orm/entity/User";

class RootController implements ControllerInterface {
  ...
  @Field("User", "isAdmin")
  async isAdmin(entity) {
    return entity.id === 1;
  }
}

export default RootController;
```

The `Field` decorator takes two parameter : the Entity name you want to assign the field to, and the field name. These must
match your GraphQL schema. 

The function that is called receive the original entity as its first input. We use it here to know wether or not the user is an
admin. You can test it now !

```
query { 
  user(id: 1) {
    id
    name
    isAdmin
  }
}
```

Outputs :
``` 
{
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe !",
      "isAdmin": true
    }
  }
}
```

## Adding an HTTP Endpoint
Adding an HTTP endpoint is as easy as cake. You can use the `Web` decorator used by the `ExpressRouter`.
Update `RootController.ts` :

```ts 
import App, { ControllerInterface, Query, Mutation, Field, Web } from "zedix"; // Add Web

class RootController implements ControllerInterface {
  ...
  @Web({ name: "getUserFromRest", method: "GET", path: "/users/:id" })
  getUserForWeb(id) {
    return App.getService("ORM").getRepository(User).findOne(id);
  }
}

export default RootController;
```

And now hit `http://localhost:4998/users/1`

```
{"id":1,"name":"John Doe !"}
```

## We're done !

Congratulations ! You've met with the basics of what Zedix provides. There's still functionnalities we havn't had time
to talk about yet, such as [GraphQL Custom Types](./custom-types.md) or [Authentication](./authentication.md). You can check the
`docs` folder to learn more. 

If you have any suggestions, please **open an issue** or **submit a PR**. Thanks you !
