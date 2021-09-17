/// <reference types="cypress" />

describe('TodoMVC GraphQL client', () => {
  it('adds a todo', () => {
    cy.visit('/')
      .should('have.property', 'graphqlClient')
      .then((client) => {
        cy.spy(client, 'mutate').as('mutate')
      })
    cy.get('.new-todo').type('Test!!!!{enter}')
    cy.get('@mutate')
      .should('have.been.calledOnce')
      .its('firstCall.args.0.variables')
      .should('deep.include', {
        title: 'Test!!!!',
      })
      .and('have.property', 'id')
  })
})
