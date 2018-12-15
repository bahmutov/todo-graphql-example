/// <reference types="cypress" />
it('loads 2 items', () => {
  cy.visit('/')
  cy.get('.todo-list li').should('have.length', 2)
})
