import React from 'react'
// import VisibleTodoList from '../containers/VisibleTodoList'
import Todos from '../Todos'
import Footer from './Footer'

const MainSection = ({ todosCount, completedCount, actions }) => (
  <section className='main'>
    {!!todosCount && (
      <span>
        <input
          className='toggle-all'
          type='checkbox'
          checked={completedCount === todosCount}
        />
        <label onClick={actions.completeAllTodos} />
      </span>
    )}
    {/* <VisibleTodoList /> */}
    <Todos />
    {!!todosCount && (
      <Footer
        completedCount={completedCount}
        activeCount={todosCount - completedCount}
        onClearCompleted={actions.clearCompleted}
      />
    )}
  </section>
)

// MainSection.propTypes = {
//   todosCount: PropTypes.number.isRequired,
//   completedCount: PropTypes.number.isRequired,
//   actions: PropTypes.object.isRequired
// }

export default MainSection
