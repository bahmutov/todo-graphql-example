// @ts-check
import { gql } from '@apollo/client'
import { client } from '../../src/graphql-client'
import { todos } from '../../db'

describe('GraphQL client', { tags: '@client' }, () => {
  // make individual GraphQL calls using the app's own client

  it('gets all todos (id, title)', () => {
    const query = gql`
      query listTodos {
        # operation name
        allTodos {
          # fields to pick
          id
          title
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
      .should('deep.equal', {
        id: todos[0].id,
        title: todos[0].title,
        __typename: 'Todo',
      })
  })

  it('gets second todo', () => {
    const query = gql`
      query getTodo {
        # operation name
        Todo(id: ${todos[1].id}) {
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
      .should('deep.equal', {
        ...todos[1],
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
          id: todos[0].id,
          completed: true,
        },
      }),
    )
      .its('data.updateTodo')
      .should('deep.equal', {
        ...todos[0],
        completed: true,
        __typename: 'Todo',
      })
  })
})
