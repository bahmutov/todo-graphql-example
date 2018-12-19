/// <reference types="cypress" />
import fetchMock from 'fetch-mock'
import JsonGraphqlServer from 'json-graphql-server'
// load JSON for GraphQL server
const data = require('../../db')

let fetches

beforeEach(() => {
  cy.visit('/', {
    onBeforeLoad (win) {
      const server = JsonGraphqlServer({ data })
      fetches = win.fetch = fetchMock.sandbox()
      // all GraphQL queries go to this endpoint
      win.fetch.post('http://localhost:3000/', server.getHandler())
    }
  })
})

it('in browser fetch mock', () => {
  cy.get('.todo-list li').should('have.length', 2)
})

it('adds an item', () => {
  cy.get('.todo-list li').should('have.length', 2)
  cy.get('.new-todo').type('new todo{enter}')
  cy.get('.todo-list li')
    .should('have.length', 3)
    .contains('new todo')
})

it('tracks number of GraphQL calls', () => {
  // just loads all todos
  expect(fetches.calls()).to.have.length(1)

  cy.get('.todo-list li').should('have.length', 2)
  cy.get('.new-todo').type('new todo{enter}')
  cy.get('.todo-list li')
    .should('have.length', 3)
    .contains('new todo')
    .then(() => {
      // mutation to add todo + query all todos again
      expect(fetches.calls()).to.have.length(3)
    })
})

const extractGraphQL = call => {
  // only interested in request body from [url, body] arguments
  const [, request] = call
  // parse query into JSON and pick two properties
  return Cypress._.pick(JSON.parse(request.body), [
    'operationName',
    'variables'
  ])
}

/**
 * Extracts GraphQL object from fetch-mock calls
 *
 * @param {number} k index of the call to return, pass -1 to get the last call
 */
const nthGraphQL = (k = -1) =>
  cy.then(() => {
    const calls = fetches.calls()
    const nthCall = Cypress._.nth(calls, k)
    if (!nthCall) {
      throw new Error(`Cannot find GraphQL call #${k}`)
    }

    return extractGraphQL(nthCall)
  })

it('uses expected GraphQL operations', () => {
  // application's random generator ignores first two digits
  // so our fake ids will be with 100, 101, 102, ...
  let counter = 10100
  cy.window()
    .its('Math')
    .then(Math => {
      cy.stub(Math, 'random').callsFake(() => counter++)
    })

  // during the application load, app queries all todos
  nthGraphQL().should('deep.equal', {
    operationName: 'allTodos',
    variables: {}
  })

  cy.get('.todo-list li').should('have.length', 2)
  cy.get('.new-todo').type('new todo{enter}')

  cy.get('.todo-list li')
    .should('have.length', 3)
    .contains('new todo')

  // addTodo mutation call
  nthGraphQL(-2).should('deep.equal', {
    operationName: 'AddTodo',
    variables: {
      id: 100, // id is no longer random
      title: 'new todo'
    }
  })

  // allTodos query call
  nthGraphQL(-1).should('deep.equal', {
    operationName: 'allTodos',
    variables: {}
  })
})
