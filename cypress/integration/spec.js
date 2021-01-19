/// <reference types="cypress" />

it('completes the first todo', () => {
  cy.intercept(
    {
      method: 'POST',
      url: '/',
    },
    (req) => {
      console.log('inside the intercept')
      throw new Error('nope')
    },
  )
  cy.visit('/')
})
