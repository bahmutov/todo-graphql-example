// @ts-check
import { deleteAll } from './utils'

describe('Delete items', () => {
  beforeEach(deleteAll)

  it('deletes all items by making GraphQL calls', () => {
    cy.intercept({
      method: 'POST',
      url: '/',
      headers: {
        'x-gql-operation-name': 'allTodos',
      },
    }).as('allTodos')

    cy.visit('/')
    cy.wait('@allTodos').its('response.body.data.allTodos').should('be.empty')
    cy.get('.todo').should('have.length', 0)
  })

  it('deletes after creating a todo', () => {
    cy.intercept({
      method: 'POST',
      url: '/',
      headers: {
        'x-gql-operation-name': 'allTodos',
      },
    }).as('allTodos')

    cy.visit('/')
    cy.wait('@allTodos').its('response.body.data.allTodos').should('be.empty')
    cy.get('.todo').should('have.length', 0)

    cy.get('.new-todo')
      .type('first task{enter}')
      .type('second task{enter}')
      .type('third task{enter}')

    cy.get('.todo')
      .should('have.length', 3)
      // add extra wait, otherwise the test goes by too quickly
      // for the human eye!
      .wait(1000)

    cy.log('**items are there after reload**')
    cy.reload()
    cy.get('.todo').should('have.length', 3).wait(1000).then(deleteAll)

    // make sure the page is loaded by waiting a bit
    cy.reload().wait(1000)
    cy.get('.todo').should('have.length', 0)
  })
})
