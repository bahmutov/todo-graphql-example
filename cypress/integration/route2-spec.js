/// <reference types="cypress" />

describe('TodoMVC with GraphQL', () => {
  const allTodos = [
    { id: '1', title: 'use GraphQL', completed: false, __typename: 'Todo' },
    {
      id: '2',
      title: 'test with Cypress',
      completed: true,
      __typename: 'Todo',
    },
  ]

  it('loads todos', () => {
    // stub ALL GraphQL calls the same way
    cy.route2(
      {
        method: 'POST',
        url: '/',
      },
      {
        body: {
          data: {
            allTodos,
          },
        },
        headers: {
          'access-control-allow-origin': '*',
        },
      },
    ).as('allTodos')
    cy.visit('/')
    cy.wait('@allTodos')
    cy.get('.todo-list li').should('have.length', 2)
  })

  it('stubs by checking operation name', () => {
    // stub only the first call to {operationName: 'allTodos'}
    let firstCall = true

    cy.route2(
      {
        method: 'POST',
        url: '/',
      },
      (req) => {
        console.log('req', req)
        const body = JSON.parse(req.body)
        if (firstCall && body.operationName === 'allTodos') {
          firstCall = false
          req.reply({
            body: {
              data: {
                allTodos,
              },
            },
            headers: {
              'access-control-allow-origin': '*',
            },
          })
        }
      },
    ).as('allTodos')

    cy.visit('/')
    cy.wait('@allTodos')
    cy.get('.todo-list li').should('have.length', 2)
    // new todos should be added
    const randomTitle = `New todo ${Cypress._.random(1e10)}`
    cy.get('.new-todo').type(`${randomTitle}{enter}`)
    cy.contains('.todo-list li', randomTitle)
  })
})
