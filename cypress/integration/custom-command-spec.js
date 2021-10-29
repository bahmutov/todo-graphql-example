// @ts-check
import { deleteAll } from './utils'

describe('Using a custom command', () => {
  it('creates todos', () => {
    deleteAll()
    cy.createTodos(['Use custom command', 'Write more tests'])
    cy.visit('/')
    cy.get('.todo').should('have.length', 2)
  })
})
