// @ts-check
import { deleteAll, createItems } from './utils'

// adding a red outline around every element with
// selector "data-cy"
function highlightSelectors() {
  cy.wrap(null, { log: false }).then(() => {
    // @ts-ignore
    const doc = cy.state('document')
    const head = doc.head
    const hasStyle = Cypress._.find(head.styleSheets, { title: 'highlight' })
    if (hasStyle) {
      return
    }

    const style = doc.createElement('style')
    style.title = 'highlight'
    style.type = 'text/css'
    style.appendChild(
      document.createTextNode(`
        [data-cy] {
          outline: 1px solid red !important;
        }
      `),
    )
    head.appendChild(style)
  })
}

describe('Highlight', () => {
  beforeEach(() => {
    // make sure we start with several todos
    deleteAll()
    const randomTodos = Cypress._.range(0, Cypress._.random(2, 4)).map((k) => {
      return {
        title: `Todo ${k}`,
        completed: Cypress._.sample([true, false]),
      }
    })
    cy.log(`creating ${randomTodos.length} todos`)
    createItems(randomTodos)
  })

  it('highlights elements with good selectors', () => {
    cy.visit('/')
    cy.get('li.todo').should('have.length.gt', 0)
    highlightSelectors()
    // the header should have the red outline
    // NOTE: not the best way to test this, but it works
    cy.get('header').should('have.css', 'outline')
    cy.screenshot({ capture: 'runner' })
  })
})
