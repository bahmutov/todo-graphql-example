# todo-graphql-example ![cypress version](https://img.shields.io/badge/cypress-8.7.0-brightgreen)
[![ci status][gh image]][gh url] [![badges status][badges image]][badges url] [![tags](https://github.com/bahmutov/todo-graphql-example/actions/workflows/tags.yml/badge.svg?branch=master&event=push)](https://github.com/bahmutov/todo-graphql-example/actions/workflows/tags.yml) [![renovate-app badge][renovate-badge]][renovate-app] [![todo-graphql-example](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/count/ahwxj4/master&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/ahwxj4/runs)

## Blog posts

- [Make GraphQL Calls From Cypress Tests](https://glebbahmutov.com/blog/request-graphql/)
- [Dynamic API Tests Using Cypress-Each Plugin](https://glebbahmutov.com/blog/dynamic-api-tests-using-cypress-each/)
- [Refactor Tests To Be Independent And Fast Using Cypress-Each Plugin](https://glebbahmutov.com/blog/refactor-using-each/)

Read [Smart GraphQL Stubbing in Cypress](https://glebbahmutov.com/blog/smart-graphql-stubbing/). Note that with the addition of [cy.intercept](https://on.cypress.io/intercept) all extra hacks became unnecessary.

## Videos

- [Toggle Todo When Using GraphQL Calls](https://www.youtube.com/watch?v=QA_moq_Yh5M)
- [Set GraphQL Network Intercept Alias](https://www.youtube.com/watch?v=jN1vsGGXAjw)
- [Set GraphQL Operation Name As Custom Header And Use It In cy.intercept](https://www.youtube.com/watch?v=AcU5mkedchM)
- [Add A New Item By Making GraphQL Call Using cy.request Command](https://www.youtube.com/watch?v=ubnJ9kWD1yQ)
- [Use Application GraphQL Client To Make Calls From The Cypress Test](https://youtu.be/6ykTS40_scM)
- [Stub The Initial Data Load Using A Fixture](https://youtu.be/IxgWmzy26gM)
- [Delete All Items Using GraphQL Client As Part Of Cypress Test](https://www.youtube.com/watch?v=l7E7K7x7V8g)
- [Directly Spying on GraphQL Calls Made By The Application](https://youtu.be/XadOqS0YNJE)
- [Dynamic Tests From Cypress.io Fixture File](https://youtu.be/EXVwvJrUGJ8)
- [Introduction To cypress-data-session Plugin](https://youtu.be/7ipCvJQixI0) using [cypress-data-session](https://github.com/bahmutov/cypress-data-session)

## Cypress tests

All tests are in the [cypress/integration](./cypress/integration) folder.

By mocking network calls using [cy.intercept](https://on.cypress.io/intercept) see the [intercept-spec.js](cypress/integration/intercept-spec.js) file.

Spec [client-spec.js](cypress/integration/client-spec.js) is testing making individual GraphQL calls using app's own client.

Spec [ui-spec.js](cypress/integration/ui-spec.js) has simple tests that do not depend on the network, and thus are hard to write.

We can use [cy.request](https://on.cypress.io/request) command to make GraphQL requests ourselves, see the [request-spec.js](./cypress/integration/request-spec.js) file.

We can stub the initial items load using a fixture file. See the spec file [fixture-spec.js](./cypress/integration/fixture-spec.js).

We delete all items in the [delete-spec.js](./cypress/integration/delete-spec.js) test. First we query all todo items, then delete them one by one.

We can import the list of items from a fixture file [cypress/fixtures/three.json](./cypress/fixtures/three.json) and create a dynamic test for each item, see the spec file [dynamic-spec.js](./cypress/integration/dynamic-spec.js).

## App

Start server with `npm start`. You can find GraphQL playground at `http://localhost:3000`

![App in action](images/app.gif)

Example asking for all todos

```
query {
  allTodos {
    id,
    title,
    completed
  }
}
```

Response

```json
{
  "data": {
    "allTodos": [
      {
        "id": "1",
        "title": "do something",
        "completed": false
      },
      {
        "id": "2",
        "title": "another",
        "completed": false
      }
    ]
  }
}
```

Example creating new todo object

```
mutation {
  createTodo(id: 2, title: "another", completed: false) {
    id
  }
}
```

Response

```json
{
  "data": {
    "createTodo": {
      "id": "2"
    }
  }
}
```

Example asking for a single todo (notice `id` argument)

```
query {
  Todo(id: 2) {
    id,
    title,
    completed
  }
}
```

Response

```json
{
  "data": {
    "Todo": {
      "id": "2",
      "title": "another",
      "completed": false
    }
  }
}
```

## Development

Backend is [json-graphql-server](https://github.com/marmelab/json-graphql-server). Front-end React code is in [src](src) folder, modeled after [Getting Started With React And GraphQL](https://medium.com/codingthesmartway-com-blog/getting-started-with-react-and-graphql-395311c1e8da) post.

To start the applications and open Cypress

```shell
$ npm run dev
# starts the API, starts the web application
# when the application responds
# opens Cypress test runner
```

To start the application and run headless Cypress tests

```shell
$ npm run local
```

## About me

- [@bahmutov](https://twitter.com/bahmutov)
- [glebbahmutov.com](https://glebbahmutov.com)
- [blog](https://glebbahmutov.com/blog)
- [videos](https://www.youtube.com/glebbahmutov)
- [presentations](https://slides.com/bahmutov)
- [cypress.tips](https://cypress.tips)

[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/
[badges image]: https://github.com/bahmutov/todo-graphql-example/workflows/badges/badge.svg?branch=master
[badges url]: https://github.com/bahmutov/todo-graphql-example/actions
[gh image]: https://github.com/bahmutov/todo-graphql-example/workflows/ci/badge.svg?branch=master
[gh url]: https://github.com/bahmutov/todo-graphql-example/actions
