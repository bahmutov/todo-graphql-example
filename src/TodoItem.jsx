import React from 'react'
import { useMutation, gql } from '@apollo/client'
import { ALL_TODOS } from './Todos'
import classNames from 'classnames'

const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    removeTodo(id: $id) {
      id
    }
  }
`

const TOGGLE_TODO = gql`
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

const TodoItem = (props) => {
  const [deleteTodo, { data }] = useMutation(DELETE_TODO, {
    refetchQueries: [{ query: ALL_TODOS }],
  })

  const [completeTodo, { data2 }] = useMutation(TOGGLE_TODO, {
    refetchQueries: [{ query: ALL_TODOS }],
    variables: {
      id: props.todo.id,
      completed: !props.todo.completed,
    },
  })

  const names = classNames({
    todo: true,
    completed: props.todo.completed,
  })
  return (
    <li className={names}>
      <div className="view">
        <input
          type="checkbox"
          className="toggle"
          checked={props.todo.completed}
          onChange={() => completeTodo(props.todo.id)}
          data-cy="toggle"
        />
        <label>{`${props.todo.title}`}</label>
        <button
          className="destroy"
          data-cy="destroy"
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
}
export default TodoItem
