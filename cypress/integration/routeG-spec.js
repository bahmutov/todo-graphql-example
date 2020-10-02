/// <reference types="cypress" />
import { routeG } from './routeG'

describe('TodoMVC with GraphQL routeG', () => {
  const allTodos = [
    { id: '1', title: 'use GraphQL', completed: false, __typename: 'Todo' },
    {
      id: '2',
      title: 'test with Cypress',
      completed: true,
      __typename: 'Todo',
    },
  ]

  it('stubs all todos', () => {
    routeG({
      allTodos(req) {
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
      },
    })
    cy.visit('/')
    cy.get('.todo-list li').should('have.length', allTodos.length)
  })

  it('stubs all todos (simpler)', () => {
    routeG(
      {
        // operation name matches "allTodos" variable name in this case
        // so stub any call to "operation: allTodos" with this response
        // that will be placed into "body: data: {...}"
        allTodos,
      },
      {
        headers: {
          'access-control-allow-origin': '*',
        },
      },
    )
    cy.visit('/')
    cy.get('.todo-list li').should('have.length', allTodos.length)
  })

  it('adds and deletes todo', () => {
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

  it('adds and deletes todo via requests and responses (better)', () => {
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

    // spy on "AddTodo" mutations to save the returned ID
    // record all outgoing "DeleteTodos" calls
    const { requests, responses, saveResponse } = routeG({
      // save the response from "AddTodo"
      AddTodo(req) {
        saveResponse('AddTodo', req)
      },
      // just record requests
      DeleteTodo() {},
    })

    const randomTitle = `Delete me ${Cypress._.random(1e4)}`
    cy.get('.new-todo')
      .type(`${randomTitle}{enter}`)
      .then(() => {
        cy.get('.todo-list li').should('have.length', todosN + 1)
      })

    cy.log('confirm **addTodo** operation')
    cy.wrap(responses)
      .its('AddTodo.0.data.createTodo.id')
      .then((id) => {
        addedTodoId = id
        cy.log(`added todo with id **${id}**`)
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
    cy.wrap(requests)
      .its('DeleteTodo')
      .should('have.length', 1)
      .its('0.variables')
      .should((variables) => {
        expect(variables).to.deep.equal({
          id: addedTodoId,
        })
      })
  })
})
