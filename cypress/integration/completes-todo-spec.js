// @ts-check

import 'cypress-data-session'
import { data } from '../fixtures/three.json'
import { createItems } from './utils'
import { deleteAll, getTodos } from './utils-using-client'

describe('completes todo', () => {
  beforeEach(() => {
    // https://github.com/bahmutov/cypress-data-session
    cy.dataSession({
      name: '3 todos',
      preSetup: deleteAll,
      setup() {
        cy.log('**create 3 items**')
        createItems(data.allTodos)
        cy.wrap(Cypress._.map(data.allTodos, 'title'))
      },
      validate(titles) {
        return getTodos().then((todos) => {
          return Cypress._.isEqual(titles, Cypress._.map(todos, 'title'))
        })
      },
    })
  })

  it('shows 3 todos', () => {
    cy.visit('/')
    cy.get('.todo').should('have.length', data.allTodos.length)
  })

  it('completes a todo', () => {
    cy.visit('/')
    cy.get('.todo')
      .should('have.length', data.allTodos.length)
      .eq(1)
      .find('.toggle')
      .click()
      .then(() => {
        Cypress.clearDataSession('3 todos')
      })
    cy.get('.todo').eq(1).should('have.class', 'completed')
  })
})
