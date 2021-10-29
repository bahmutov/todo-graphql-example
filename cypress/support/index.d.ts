declare namespace Cypress {
  interface Chainable {
    createTodos(titles: string[]): Chainable<void>
  }
}
