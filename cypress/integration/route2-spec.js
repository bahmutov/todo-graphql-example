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

  it('shows loading indicator', () => {
    // stub ALL GraphQL calls the same way
    cy.route2(
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
        headers: {
          'access-control-allow-origin': '*',
        },
      },
    ).as('allTodos')

    cy.visit('/')
    cy.get('.loading').should('be.visible')
    // then the allTodos resolves
    cy.wait('@allTodos')
    // and the loading indicator goes away
    cy.get('.loading').should('not.be.visible')
  })

  // does not work - we cannot add several listeners to the same
  // route, since the first match stops the check
  it.skip('adds and deletes todo', () => {
    cy.visit('/')
    cy.get('.loading').should('not.exist')

    let todosN
    cy.get('.todo-list li')
      .should('have.length.gte', 0)
      .then((todos) => {
        todosN = todos.length
      })

    // let's add new todo
    // but first spy on "operationName: AddTodo"
    // find the id of the new todo by searching the "AddTodo" mutations
    let addedTodoId
    cy.route2(
      {
        method: 'POST',
        url: '/',
      },
      (req) => {
        const body = JSON.parse(req.body)
        if (body.operationName === 'AddTodo') {
          req.reply((res) => {
            const serverResponse = JSON.parse(res.body)
            addedTodoId = serverResponse.data.createTodo.id
          })
        }
      },
    )

    const randomTitle = `Delete me ${Cypress._.random(1e10)}`
    cy.get('.new-todo')
      .type(`${randomTitle}{enter}`)
      .then(() => {
        cy.get('.todo-list li').should('have.length', todosN + 1)
      })

    cy.get('@deleteTodos').should('have.been.calledOnce').its('firstCall')

    // spy on "operationName: DeleteTodo"
    const deletedTodos = cy.stub().as('deleteTodos')
    cy.route2(
      {
        method: 'POST',
        url: '/',
      },
      (req) => {
        const body = JSON.parse(req.body)
        if (body.operationName === 'DeleteTodo') {
          deletedTodos(body)
        }
      },
    )

    cy.contains('.todo-list li', randomTitle)
      .find('.destroy')
      .click({ force: true })
      .then(() => {
        // back to original length
        cy.get('.todo-list li').should('have.length', todosN)
      })
    // and the new todo should not exist
    cy.contains('.todo-list li', randomTitle).should('not.exist')

    // confirm the delete mutation was called
    // cy.get('@deleteTodos')
    //   .should('have.been.calledOnce')
    //   .its('firstCall.args.0.variables')
    //   .should('deep.equal', {
    //     id: todoId,
    //   })
  })

  it('adds and deletes todo single route2', () => {
    cy.visit('/')
    cy.get('.loading').should('not.exist')

    let todosN
    cy.get('.todo-list li')
      .should('have.length.gte', 0)
      .then((todos) => {
        todosN = todos.length
      })

    const routeG = (operations) => {
      cy.route2(
        {
          method: 'POST',
        },
        (req) => {
          const body = JSON.parse(req.body)

          const operationHandler = operations[body.operationName]
          if (!operationHandler) {
            console.log('no handler for operation %s', body.operationName)
            return
          }
          console.log('handling operation %s', body.operationName)
          return operationHandler(req, body)
        },
      )
    }

    // let's add new todo
    // but first spy on "operationName: AddTodo"
    // find the id of the new todo by searching the "AddTodo" mutations
    let addedTodoId
    const deletedTodos = cy.stub().as('deleteTodos')

    // spy on "AddTodo" mutations to save the returned ID
    // record all outgoing "DeleteTodos" calls
    routeG({
      AddTodo(req, body) {
        req.reply((res) => {
          const serverResponse = JSON.parse(res.body)
          addedTodoId = serverResponse.data.createTodo.id
          console.log('added todo id %s', addedTodoId)
        })
      },
      DeleteTodo(req, body) {
        deletedTodos(body)
      },
    })

    const randomTitle = `Delete me ${Cypress._.random(1e4)}`
    cy.get('.new-todo')
      .type(`${randomTitle}{enter}`)
      .then(() => {
        cy.get('.todo-list li').should('have.length', todosN + 1)
      })

    cy.contains('.todo-list li', randomTitle)
      .find('.destroy')
      .click({ force: true })
      .then(() => {
        // back to original length
        cy.get('.todo-list li').should('have.length', todosN)
      })
    // and the new todo should not exist
    cy.contains('.todo-list li', randomTitle).should('not.exist')

    // confirm the delete mutation was called
    cy.log('confirm **DeleteTodo** was called')
    cy.get('@deleteTodos')
      .should('have.been.calledOnce')
      .its('firstCall.args.0.variables')
      .should((variables) => {
        expect(variables).to.deep.equal({
          id: addedTodoId,
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
