import classnames from 'classnames'
import gql from 'graphql-tag'
import React, { Component } from 'react'
import { Mutation } from 'react-apollo'

const ADD_TODO = gql`
  mutation AddTodo($id: ID!, $title: String!) {
    createTodo(id: $id, title: $title) {
      id
    }
  }
`

export default class TodoTextInput extends Component {
  // static propTypes = {
  //   onSave: PropTypes.func.isRequired,
  //   text: PropTypes.string,
  //   placeholder: PropTypes.string,
  //   editing: PropTypes.bool,
  //   newTodo: PropTypes.bool
  // }

  constructor (props) {
    super(props)
    this.state = {
      text: this.props.text || ''
    }
  }

  handleSubmit (addTodo, e) {
    const text = e.target.value.trim()
    if (e.which === 13) {
      // this.props.onSave(text)
      addTodo({
        variables: {
          id: 1,
          title: text,
          completed: false
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
      <Mutation mutation={ADD_TODO}>
        {(addTodo, { data }) => (
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
