// @ts-check

/**
 * @typedef {Object} Todo
 * @property {string} title
 * @property {boolean} completed ’
 */
/**
 * Creates items on the server one by one
 * @param {Todo[]} todos
 */
export function createItems(todos) {
  todos.forEach((item) => {
    // create the item using a network call
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/',
      body: {
        operationName: 'AddTodo',
        query: `
          mutation AddTodo($title: String!, $completed: Boolean!) {
            createTodo(title: $title, completed: $completed) {
              id
            }
          }
        `,
        variables: {
          title: item.title,
          completed: item.completed,
        },
      },
    })
  })
}
