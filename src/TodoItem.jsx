import React from 'react'
// import gql from 'graphql-tag'
// import { Mutation } from 'react-apollo'
import { useMutation, gql } from '@apollo/client'
import { ALL_TODOS } from './Todos'

const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    removeTodo(id: $id)
  }
`

const TOGGLE_TODO = gql`
  mutation ToggleTodo($id: ID!) {
    toggleTodo(id: $id)
  }
`

const TodoItem = (props) => {
  const completeTodo = (id) => {
    console.log('TODO: complete todo %s', id)
  }

  const [deleteTodo, { data }] = useMutation(DELETE_TODO, {
    refetchQueries: [{ query: ALL_TODOS }],
  })

  // return (
  // <Mutation mutation={DELETE_TODO} refetchQueries={[{ query: ALL_TODOS }]}>
  // {(deleteTodo) => (
  return (
    <li className={props.todo.completed ? 'completed' : ''}>
      <div className="view">
        <input
          type="checkbox"
          className="toggle"
          checked={props.todo.completed}
          onChange={() => completeTodo(todo.id)}
        />
        <label>{`${props.todo.title}`}</label>
        <button
          className="destroy"
          onClick={() => {
            deleteTodo({
              variables: {
                id: props.todo.id,
              },
            })
          }}
        />
      </div>
    </li>
  )
  // )}
  // </Mutation>
  // )
}
export default TodoItem
