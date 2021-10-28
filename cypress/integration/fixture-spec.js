// @ts-check
describe('TodoMVC', { tags: '@intercept' }, () => {
  it('starts with N items', () => {
    cy.intercept(
      {
        method: 'POST',
        url: '/',
        headers: {
          'x-gql-operation-name': 'allTodos',
        },
      },
      {
        fixture: 'three.json',
      },
    ).as('allTodos')
    cy.visit('/')
    cy.get('.todo').should('have.length', 3)
    cy.get('.todo.completed').should('have.length', 2)
    cy.get('.todo').not('.completed').should('have.length', 1)
    // the above command splits the cy.get from cy.not commands
    // which can run into troubles. For better retry-ability,
    // we should use a single DOM query command.
    // Luckily, cy.get supports jQuery selector syntax ":not"
    // which we can use to filter the completed items.
    // https://on.cypress.io/retry-ability
    cy.get('.todo:not(.completed)').should('have.length', 1)
  })
})
