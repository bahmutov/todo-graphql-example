/// <reference types="cypress" />

describe('TodoMVC', () => {
  it('toggles todo', () => {
    // this test looks at the page UI
    // to determine how the class changes
    // when we toggle a todo
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

  it('toggles todo after observing network calls', () => {
    // this test spies on the initial network call
    // to see the first todo item and if it is completed or not
    cy.intercept('POST', '/').as('allTodos')
    cy.visit('/')
    cy.wait('@allTodos')
      .its('response.body.data.allTodos.0.completed')
      .then((completed) => {
        // from the network response
        // we can form the right assertion
        const classAssertion = completed ? 'have.class' : 'not.have.class'
        cy.get('.todo')
          .should('have.length', 2)
          .first()
          .should(classAssertion, 'completed')
          .find('.toggle')
          .click()

        const toggleAssertion = completed ? 'not.have.class' : 'have.class'
        cy.get('.todo')
          .should('have.length', 2)
          .first()
          .should(toggleAssertion, 'completed')
      })
  })
})
