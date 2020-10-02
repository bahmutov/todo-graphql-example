import React from 'react'
const TodoItem = (props) => {
  console.log('todo item props', props)

  const completeTodo = (id) => {
    console.log('TODO: complete todo %s', id)
  }

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
        <button className="destroy" />
      </div>
    </li>
  )
}
export default TodoItem
