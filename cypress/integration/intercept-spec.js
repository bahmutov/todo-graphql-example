/// <reference types="cypress" />

// note: previously used cy.route2 command is officially cy.intercept
describe('TodoMVC with GraphQL cy.intercept', () => {
  const allTodos = [
    { id: '1', title: 'use GraphQL', completed: false, __typename: 'Todo' },
    {
      id: '2',
      title: 'test with Cypress',
      completed: true,
      __typename: 'Todo',
    },
  ]

  it('completes the first todo', () => {
    let allTodosCount = 0

    cy.intercept(
      {
        method: 'POST',
        url: '/',
      },
      (req) => {
        expect(req.body, 'request has been parsed').to.be.an('object')
        const g = req.body
        if (g.operationName === 'allTodos') {
          allTodosCount += 1

          if (allTodosCount === 1) {
            req.reply({
              body: {
                data: {
                  allTodos,
                },
              },
            })
          } else if (allTodosCount === 2) {
            const completedFirstTodo = Cypress._.cloneDeep(allTodos)
            completedFirstTodo[0].completed = true
            req.reply({
              body: {
                data: {
                  allTodos: completedFirstTodo,
                },
              },
            })
          } else {
            throw new Error('Did not expect more allTodos requests')
          }
        } else if (g.operationName === 'updateTodo') {
          // confirm the web app sends the right variables
          // to make a todo completed
          expect(g.variables).to.deep.equal({
            id: '1',
            completed: true,
          })
          req.reply()
        } else {
          throw new Error(`Unexpected operation ${g.operationName}`)
        }
      },
    )
    cy.visit('/')
    cy.get('.todo-list li')
      .should('have.length', 2)
      .first()
      .should('not.have.class', 'completed')
      .find('.toggle')
      .click({ force: true })

    cy.get('.todo-list li').first().should('have.class', 'completed')
  })

  it('stubs todos query', () => {
    // stub ALL GraphQL calls the same way
    cy.intercept(
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

  it('shows loading indicator', () => {
    // stub ALL GraphQL calls the same way
    cy.intercept(
      {
        method: 'POST',
        url: '/',
      },
      {
        delayMs: 300,
        body: {
          data: {
            allTodos,
          },
        },
      },
    ).as('allTodos')

    cy.visit('/')
    cy.get('.loading').should('be.visible')
    // then the allTodos resolves
    cy.wait('@allTodos')
    // and the loading indicator goes away
    cy.get('.loading').should('not.exist')
  })

  it('adds and deletes todo', () => {
    cy.visit('/')
    cy.get('.loading').should('not.exist')

    let todosN
    cy.get('.todo-list li')
      .should('have.length.gte', 0)
      .then((todos) => {
        todosN = todos.length
        cy.log(`starts with **${todosN}** items`)
      })

    // let's add new todo
    // but first spy on "operationName: AddTodo"
    cy.intercept(
      {
        method: 'POST',
        url: '/',
      },
      (req) => {
        const { body } = req
        req.alias = body.operationName
      },
    )

    const randomTitle = `To be deleted ${Cypress._.random(1e10)}`
    cy.get('.new-todo')
      .type(`${randomTitle}{enter}`)
      .then(() => {
        cy.get('.todo-list li').should('have.length', todosN + 1)
      })
    // confirm the call to add an item has been made
    cy.wait('@AddTodo')

    cy.contains('.todo-list li', randomTitle)
      .find('.destroy')
      .click({ force: true })
      .then(() => {
        // back to original length
        cy.get('.todo-list li').should('have.length', todosN)
      })
    // and the new todo should not exist
    cy.contains('.todo-list li', randomTitle).should('not.exist')

    // confirm the call to delete the item has been made
    cy.wait('@DeleteTodo')
  })

  it('stubs by checking operation name', () => {
    // stub only the first call to {operationName: 'allTodos'}
    let firstCall = true

    cy.intercept(
      {
        method: 'POST',
        url: '/',
      },
      (req) => {
        const body = req.body
        if (firstCall && body.operationName === 'allTodos') {
          firstCall = false
          req.reply({
            body: {
              data: {
                allTodos,
              },
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

    cy.intercept(
      {
        method: 'POST',
        url: '/',
      },
      (req) => {
        const body = req.body
        if (body.operationName === 'AddTodo') {
          req.reply((res) => {
            todoResponse = res.body.data
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
