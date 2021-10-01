/// <reference types="cypress" />

import { gql } from '@apollo/client'
import { client } from '../../src/graphql-client'

describe('Make GraphQL requests', () => {
  it('fetches all items', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/',
      body: {
        operationName: 'allTodos',
        query: `
          query allTodos {
            allTodos {
              id,
              title,
              completed
            }
          }
        `,
      },
    })
      .its('body.data.allTodos')
      // depends on the order of specs
      // so let's be generous and not assume strict number
      .should('have.length.gte', 0)
  })

  it('fetches all items using application client', () => {
    // make a GraphQL query using the app's client
    // https://www.apollographql.com/docs/react/data/queries/
    const query = gql`
      query allTodos {
        allTodos {
          id
          title
          completed
        }
      }
    `

    // use https://on.cypress.io/wrap to let the Cypress test
    // wait for the promise returned by the "client.query" to resolve
    cy.wrap(
      client.query({
        query,
        // it is important to AVOID any caching here
        // and fetch the current server data
        fetchPolicy: 'no-cache',
      }),
    )
      .its('data.allTodos')
      .should('have.length.gte', 0)
  })

  it('creates one item', () => {
    const random = Cypress._.random(1e5)
    const title = `test ${random}`
    cy.log(`Adding item ${title}`)
      .then(() => {
        const query = gql`
          mutation AddTodo($title: String!) {
            createTodo(title: $title, completed: false) {
              id
            }
          }
        `

        // by returning the promise returned by the "client.query"
        // call from the .then callback, we force the test to wait
        // and yield the result to the next Cypress command or assertion
        return client.query({
          query,
          variables: {
            title,
          },
          // it is important to AVOID any caching here
          // and fetch the current server data
          fetchPolicy: 'no-cache',
        })
      })
      // use zero timeout to avoid "cy.its" retrying
      // since the response object is NOT going to change
      .its('data.createTodo', { timeout: 0 })
      .should('have.property', 'id')

    // the item we have created should be shown in the list
    cy.visit('/')
    cy.contains('.todo', title)
  })

  it('creates an item and fetches it', () => {
    cy.visit('/').wait(1000)
    const random = Cypress._.random(1e5)
    const title = `test ${random}`
    cy.log(`Adding item ${title}`)
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/',
      body: {
        operationName: 'AddTodo',
        query: `
          mutation AddTodo($title: String!) {
            createTodo(title: $title, completed: false) {
              id
            }
          }
        `,
        variables: {
          title,
        },
      },
    })
      .its('body.data.createTodo')
      .should('have.property', 'id')
      .then((id) => {
        // make a GraphQL query using the app's client
        // https://www.apollographql.com/docs/react/data/queries/
        const query = gql`
          query getTodo($id: ID!) {
            Todo(id: $id) {
              id
              title
              completed
            }
          }
        `
        // use cy.wrap command to tell Cypress to wait for
        // the query to resolve before proceeding to the next command
        cy.wrap(client.query({ query, variables: { id } }))
          // the query yields a Todo object
          // that we can validate
          .its('data.Todo')
          .should('deep.include', {
            id,
            completed: false,
            title,
          })
      })

    cy.reload()
    cy.contains('.todo', title)
  })
})
