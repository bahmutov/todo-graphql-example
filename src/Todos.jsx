import gql from 'graphql-tag'
import React from 'react'
import { Query } from 'react-apollo'
import TodoItem from './TodoItem'

export const ALL_TODOS = gql`
  query allTodos {
    allTodos {
      id
      title
      completed
    }
  }
`

const Todos = () => (
  <Query query={ALL_TODOS}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>
      if (error) return <p>Error :(</p>
      return (
        <ul className='todo-list'>
          {data.allTodos.map(todo => (
            <TodoItem todo={todo} key={todo.id} />
          ))}
        </ul>
      )
    }}
  </Query>
)
export default Todos
