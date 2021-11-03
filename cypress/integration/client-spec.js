// @ts-check
import { gql } from '@apollo/client'
import { client } from '../../src/graphql-client'
import { todos } from '../../db'
import { deleteAll, createItems } from './utils'

// make individual GraphQL calls using the app's own client
describe('GraphQL client', { tags: '@client' }, () => {
  before(() => {
    deleteAll()
    // @ts-ignore
    createItems(todos)
  })

  it('gets all todos (id, title)', () => {
    const query = gql`
      query listTodos {
        # operation name
        allTodos {
          # fields to pick
          id
          title
          completed
        }
      }
    `

    cy.wrap(
      client.query({
        query,
      }),
    )
      .its('data.allTodos')
      .should('have.length.gte', 2)
      .its('0')
      .should('deep.include', {
        title: todos[0].title,
        completed: todos[0].completed,
        __typename: 'Todo',
      })
      .and('have.property', 'id')
  })

  it('gets second todo', () => {
    const query = gql`
      query getTodo {
        # operation name
        Todo(id: 1) {
          # fields to pick
          id
          title
          completed
        }
      }
    `

    cy.wrap(
      client.query({
        query,
      }),
    )
      .its('data.Todo')
      .should('deep.include', {
        ...todos[1],
        // ID will be dynamically generated
        // after deleting all existing todos
        id: '1',
        __typename: 'Todo',
      })
  })

  it('mutates the first todo as completed', () => {
    const m = gql`
      mutation updateTodo($id: ID!, $completed: Boolean!) {
        # operation name
        updateTodo(id: $id, completed: $completed) {
          # return fields
          id
          title
          completed
        }
      }
    `
    cy.wrap(
      client.mutate({
        mutation: m,
        variables: {
          id: '0',
          completed: true,
        },
      }),
    )
      .its('data.updateTodo')
      .should('deep.equal', {
        ...todos[0],
        id: '0',
        completed: true,
        __typename: 'Todo',
      })
  })
})
