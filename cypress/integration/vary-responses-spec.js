// @ts-check
describe('TodoMVC', () => {
  it('returns zero, one, two, and three items', () => {
    // we will visit the page four times, and each time
    // the cy.intercept will response with a different fixture

    // all the Ajax calls we want to intercept
    // have the same pattern
    const matchAllTodos = {
      method: 'POST',
      url: '/',
      headers: {
        'x-gql-operation-name': 'allTodos',
      },
      // we will use each response just once
      times: 1,
    }

    // Note: if multiple intercepts match,
    // then Cypress applies them from the last to the first one
    // thus we define the one-time intercepts from the last to the first

    // the fourth request
    cy.intercept(matchAllTodos, {
      fixture: 'three.json',
    }).as('fourth')

    // third request
    cy.intercept(matchAllTodos, {
      fixture: 'two.json',
    }).as('third')

    // on the second request to fetch all items,
    // respond with a fixture with one item
    // again, use this intercept just once
    cy.intercept(matchAllTodos, {
      fixture: 'one.json',
    }).as('second')

    // on the very first request, respond with and empty list
    // but only use this interceptor once
    cy.intercept(matchAllTodos, {
      fixture: 'zero.json',
    }).as('first')

    // confirm each request is intercepted
    // and a different fixture is used
    cy.visit('/')
    cy.wait('@first')
    cy.get('.todo').should('not.exist').wait(3000)

    cy.reload()
    cy.wait('@second')
    cy.get('.todo').should('have.length', 1).wait(3000)

    cy.reload()
    cy.wait('@third')
    cy.get('.todo').should('have.length', 2).wait(3000)

    cy.reload()
    cy.wait('@fourth')
    cy.get('.todo').should('have.length', 3).wait(3000)
  })
})
