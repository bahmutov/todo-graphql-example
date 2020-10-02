/// <reference types="cypress" />

describe('TodoMVC', () => {
  it('completes todo', () => {
    let startClass
    cy.visit('/')
    cy.get('li.todo')
      .should('have.length.gt', 0)
      .first()
      .invoke('attr', 'class')
      .then((x) => {
        startClass = x
      })

    cy.get('li.todo').first().find('.toggle').click()

    // the class names should change
    cy.get('li.todo')
      .first()
      .invoke('attr', 'class')
      .should((x) => {
        expect(x).to.not.equal(startClass)
      })
  })
})
