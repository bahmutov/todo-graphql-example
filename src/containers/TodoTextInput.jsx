import React, { Component } from 'react'
import { ALL_TODOS } from '../Todos'
import { useMutation, gql } from '@apollo/client'

/**
 * Creates an ID for new todo item
 * using Math.random() to be sent to the server
 */
function randomId() {
  return Number(Math.random().toString().substr(2, 10))
}

const ADD_TODO = gql`
  mutation AddTodo($id: ID!, $title: String!) {
    createTodo(id: $id, title: $title, completed: false) {
      id
    }
  }
`

export default function TodoTextInput() {
  let input
  const [addTodo, { data }] = useMutation(ADD_TODO, {
    refetchQueries: [{ query: ALL_TODOS }],
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        addTodo({ variables: { title: input.value, id: randomId() } })
        input.value = ''
      }}
    >
      <input
        className="new-todo"
        ref={(node) => {
          input = node
        }}
      />
    </form>
  )
}
