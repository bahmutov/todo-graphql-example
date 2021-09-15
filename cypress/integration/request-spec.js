/// <reference types="cypress" />

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

    cy.reload()
    cy.contains('.todo', title)
  })
})
