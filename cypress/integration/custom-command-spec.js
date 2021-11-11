// @ts-check
import { deleteAll, createItems } from './utils'

Cypress.Commands.add('createTodos', (titles) => {
  const items = titles.map((title) => ({
    title,
    completed: false,
  }))
  return createItems(items)
})

describe('Using a custom command', () => {
  it('creates todos', () => {
    deleteAll()
    cy.createTodos(['Use custom command', 'Write more tests'])
    cy.visit('/')
    cy.get('.todo').should('have.length', 2)
  })
})
