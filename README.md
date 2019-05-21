# Zedix

A framework to develop GraphQL API's really quick !
Features :

* Typescript and Nodemon development
* TypeORM with MySQL by default (configurable)
* Express
* GraphQL with Apollo Server
* nodemailer
* winston for logging

### Walkthrough
To get a good grasp at Zedix, start by looking at [the walkthrough](docs/walkthrough.md). It will guide you
through your journey. Zedix is pretty small, so it wont take more than 20 minutes to get along !

### Get started

```
yarn global add zedix
zedix init --name MyProject
cd MyProject
```

Or

```
npm i zedix -g
zedix init --name MyProject
cd MyProject
```

### Motivation
The lack of a fully-featured framework to develop strong APIs out of the box in NodeJS has pushed me
over time to develop such a solution that would have everything I need from the get-go to develop a solid
GraphQL API quickly.

As such, **Zedix** main goals are to be :
* **As complete as possible**, taking every features an API requires in its very core
* **Modulable**, as to enhance and change its behavior if required
* **Idiomatic**, choosing strong solutions to common problems, such as TypeORM for database management or Apollo-Server for GraphQL.

### What's next
Here's a list of task i'm aiming to develop to make **Zedix** even better :
* Enhance the project scaffolding experience. First, put a script in the template repository that will perform all the necessary
operations to get started, such as configuring the database.
* Add scripts to create controllers, schema or entities.
* Write docs
* Install JS by default, TS as an option.
* Create a third package named zedix-cli that will contain CLI logic (scaffolding, running development environment...)
* Group all the repositories under this one.
* Allow more extensibility (choosing specific Apollo/Express/TypeORM versions for example). Not sure if it's
a good idea but worth thinking about.
