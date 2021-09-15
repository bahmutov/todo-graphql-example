/// <reference types="cypress" />

import { gql } from '@apollo/client'
import { client } from '../../src/graphql-client'

describe('Make GraphQL requests', () => {
  it('creates an item', () => {
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
