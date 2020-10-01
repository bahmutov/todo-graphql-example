/// <reference types="cypress" />
import fetchMock from 'fetch-mock'
import JsonGraphqlServer from 'json-graphql-server'

describe('using json-graphql-server', () => {
  // load JSON for GraphQL server
  const data = require('../../db')

  let fetches

  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(win) {
        // avoid mutating global data singleton
        const copied = Cypress._.cloneDeep(data)
        const server = JsonGraphqlServer({ data: copied })
        fetches = win.fetch = fetchMock.sandbox()
        // all GraphQL queries go to this endpoint
        win.fetch.post('http://localhost:3000/', server.getHandler())
      },
    })
  })

  it('adds an item', () => {
    cy.get('.todo-list li').should('have.length', 2)
    cy.get('.new-todo').type('new todo{enter}')
    cy.get('.todo-list li').should('have.length', 3).contains('new todo')
  })

  it('in browser fetch mock', () => {
    cy.get('.todo-list li').should('have.length', 2)
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

  /**
   * Parses array returned by "fetch-mock" to get GraphQL information
   */
  const extractGraphQL = (call) => {
    // only interested in request body from [url, body] arguments
    const [, request] = call
    // parse query into JSON and pick two properties
    return Cypress._.pick(JSON.parse(request.body), [
      'operationName',
      'variables',
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
      .then((Math) => {
        cy.stub(Math, 'random').callsFake(() => counter++)
      })

    // during the application load, app queries all todos
    nthGraphQL().should('deep.equal', {
      operationName: 'allTodos',
      variables: {},
    })

    cy.get('.todo-list li').should('have.length', 2)
    cy.get('.new-todo').type('new todo{enter}')

    cy.get('.todo-list li').should('have.length', 3).contains('new todo')

    // nthGraphQL is helper function that gets
    // a specific fetch call to GraphQL endpoint

    // addTodo mutation call
    nthGraphQL(-2).should('deep.equal', {
      operationName: 'AddTodo',
      variables: {
        id: 100, // id is no longer random
        title: 'new todo',
      },
    })

    // allTodos query call
    nthGraphQL(-1).should('deep.equal', {
      operationName: 'allTodos',
      variables: {},
    })
  })

  it('shows new item after reload', () => {
    // starts with new item
    cy.get('.todo-list li').should('have.length', 2)
    cy.get('.new-todo').type('new todo{enter}')

    // now has 3 items
    cy.get('.todo-list li').should('have.length', 3).contains('new todo')

    // shows 3 items after the user reloads the page?

    // currently deletes the window.fetch mock
    // so we need to set it again before the window loads
    cy.on('window:before:load', (win) => {
      // fetches was created in `cy.visit` callback
      win.fetch = fetches
    })
    cy.reload()
    // still 3 items after page reload
    cy.get('.todo-list li').should('have.length', 3)
  })
})
