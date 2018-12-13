import React from 'react'
const TodoItem = props => (
  <li className=''>
    <div className='view'>
      <input type='checkbox' className='toggle' value='on' />
      <label>{`${props.todo.title}`}</label>
      <button className='destroy' />
    </div>
  </li>
)
export default TodoItem
