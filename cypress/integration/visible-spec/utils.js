// @ts-check

export const testTitle = (selector, k) =>
  `testing ${k + 1} selector ${selector}`

export const testElementSelector = (selector) => {
  cy.visit('/')
  // simulate slow-loading page
  cy.wait(10000)
  cy.get(selector).should('be.visible')
}
