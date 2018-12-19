/// <reference types="cypress" />
import fetchMock from 'fetch-mock'
import JsonGraphqlServer from 'json-graphql-server'
// load JSON for GraphQL server
const data = require('../../db')

// it('loads 2 items', () => {
//   cy.visit('/')
//   cy.get('.todo-list li').should('have.length', 2)
// })

// it('shows loading message', () => {
//   cy.server()
//   cy.route({
//     method: 'POST',
//     url: 'http://localhost:3000/',
//     delay: 1000,
//     status: 200,
//     response: 'fixture:empty-list-no-errors'
//   })

//   cy.visit('/', {
//     onBeforeLoad (win) {
//       // force Apollo client to use XHR
//       delete win.fetch
//     }
//   })
//   cy.contains('.main', 'Loading...').should('be.visible')
//   // and then it should disappear from the DOM
//   cy.contains('.main', 'Loading...').should('not.exist')
// })

it.only('in browser fetch mock', () => {
  cy.visit('/', {
    onBeforeLoad (win) {
      const server = JsonGraphqlServer({ data })
      win.fetch = fetchMock.sandbox()
      // all GraphQL queries go to this endpoint
      win.fetch.post('http://localhost:3000/', server.getHandler())
    }
  })

  cy.get('.todo-list li').should('have.length', 2)
})

it('adds item', () => {
  let fetches

  cy.visit('/', {
    onBeforeLoad (win) {
      const server = JsonGraphqlServer({ data })
      win.fetch = fetches = fetchMock.sandbox()
      // all GraphQL queries go to this endpoint
      win.fetch.post('http://localhost:3000/', server.getHandler())
    }
  })

  cy.get('.todo-list li')
    .should('have.length', 2)
    .then(() => {
      console.log('fetches', fetches.calls().length)
    })
  cy.get('.new-todo').type('new todo{enter}')
  cy.get('.todo-list li')
    .should('have.length', 3)
    .contains('new todo')
    .then(() => {
      console.log('fetches', fetches.calls().length)
    })
})
