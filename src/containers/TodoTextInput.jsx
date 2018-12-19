import classnames from 'classnames'
import gql from 'graphql-tag'
import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { ALL_TODOS } from '../Todos'

function randomId () {
  return Number(
    Math.random()
      .toString()
      .substr(2, 10)
  )
}

const ADD_TODO = gql`
  mutation AddTodo($id: ID!, $title: String!) {
    createTodo(id: $id, title: $title, completed: false) {
      id
    }
  }
`

export default class TodoTextInput extends Component {
  constructor (props) {
    super(props)
    this.state = {
      text: this.props.text || ''
    }
  }

  handleSubmit (addTodo, e) {
    const text = e.target.value.trim()
    if (e.which === 13) {
      addTodo({
        variables: {
          id: randomId(),
          title: text
        }
      })
      if (this.props.newTodo) {
        this.setState({ text: '' })
      }
    }
  }

  handleChange (e) {
    this.setState({ text: e.target.value })
  }

  handleBlur (e) {
    if (!this.props.newTodo) {
      this.props.onSave(e.target.value)
    }
  }

  render () {
    return (
      <Mutation mutation={ADD_TODO} refetchQueries={[{ query: ALL_TODOS }]}>
        {addTodo => (
          <input
            className={classnames({
              edit: this.props.editing,
              'new-todo': this.props.newTodo
            })}
            type='text'
            placeholder={this.props.placeholder}
            autoFocus
            value={this.state.text}
            onBlur={this.handleBlur.bind(this)}
            onChange={this.handleChange.bind(this)}
            onKeyDown={this.handleSubmit.bind(this, addTodo)}
          />
        )}
      </Mutation>
    )
  }
}
