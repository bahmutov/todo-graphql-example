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

  it('stubs todos query', () => {
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
    cy.get('.todo-list li')
      .should('have.length', 2)
      .then(() => {
        // check that UI correctly reflects the mocked data
        allTodos.forEach((todo) => {
          if (todo.completed) {
            cy.contains('.todo-list li', todo.title).should(
              'have.class',
              'completed',
            )
          } else {
            cy.contains('.todo-list li', todo.title).should(
              'not.have.class',
              'completed',
            )
          }
        })
      })
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

  it('spies on adding todos', () => {
    let todoResponse

    cy.route2(
      {
        method: 'POST',
        url: '/',
      },
      (req) => {
        const body = JSON.parse(req.body)
        if (body.operationName === 'AddTodo') {
          req.reply((res) => {
            todoResponse = JSON.parse(res.body).data
            console.log('new todo')
            console.log(todoResponse)
          })
        }
      },
    )

    cy.visit('/')

    // new todos should be added
    const randomTitle = `New todo ${Cypress._.random(1e10)}`
    cy.get('.new-todo').type(`${randomTitle}{enter}`)

    cy.contains('.todo-list li', randomTitle)
      .should(() => {
        expect(todoResponse)
          .to.be.an('object')
          .and.to.have.property('createTodo')
      })
      .then(() => {
        cy.wrap(todoResponse.createTodo).as('todo')
      })

    cy.get('@todo').should('have.property', 'id')
  })
})
