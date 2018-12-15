/// <reference types="cypress" />
it('loads 2 items', () => {
  cy.visit('/')
  cy.get('.todo-list li').should('have.length', 2)
})

it('shows loading message', () => {
  cy.server()
  cy.route({
    method: 'POST',
    url: 'http://localhost:3000/',
    delay: 1000,
    status: 200,
    response: {
      errors: [],
      data: {
        allTodos: []
      }
    }
  })

  cy.visit('/', {
    onBeforeLoad (win) {
      // force Apollo client to use XHR
      delete win.fetch
    }
  })
  cy.contains('.main', 'Loading...').should('be.visible')
  // and then it should disappear from the DOM
  cy.contains('.main', 'Loading...').should('not.exist')
})
