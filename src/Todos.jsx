import gql from 'graphql-tag'
import React from 'react'
import { Query } from 'react-apollo'
import TodoItem from './TodoItem'

const Todos = () => (
  <Query
    query={gql`
      {
        allTodos {
          id
          title
          completed
        }
      }
    `}
  >
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
