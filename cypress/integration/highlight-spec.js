// @ts-check
import { deleteAll, createItems } from './utils'
// https://github.com/bahmutov/cypress-highlight
import { highlight } from 'cypress-highlight'
const { range, random, sample } = Cypress._

describe('Highlight', () => {
  beforeEach(() => {
    // make sure we start with several todos
    deleteAll()
    const randomTodos = range(0, random(2, 4)).map((k) => {
      return {
        title: `Todo ${k}`,
        completed: sample([true, false]),
      }
    })
    cy.log(`creating ${randomTodos.length} todos`)
    createItems(randomTodos)
  })

  it('highlights elements with good selectors', () => {
    cy.visit('/')
    cy.get('li.todo').should('have.length.gt', 0)
    highlight('[data-cy]', '.todo')
    cy.screenshot('selectors', { capture: 'runner' })
  })
})
