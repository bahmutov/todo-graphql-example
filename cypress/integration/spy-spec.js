// @ts-check

describe('TodoMVC GraphQL client', { tags: '@client' }, () => {
  it('adds a todo', () => {
    // set up the spy on "client.mutate" method
    cy.visit('/')
      .should('have.property', 'graphqlClient')
      .then((client) => {
        // @ts-ignore
        cy.spy(client, 'mutate').as('mutate')
      })
    // have the application make the call by using the UI
    cy.get('.new-todo').type('Test!!!!{enter}')
    // confirm the call has happened with expected variables
    cy.get('@mutate')
      .should('have.been.calledOnce')
      .its('firstCall.args.0.variables')
      .should('deep.include', {
        title: 'Test!!!!',
      })
      .and('have.property', 'id')
  })

  it('adds a todo (alias)', () => {
    // set up the spy on "client.mutate" method
    cy.visit('/')
      .should('have.property', 'graphqlClient')
      .then((client) => {
        // once the ".as" command finishes
        // we can access the spy using the "this.mutate" property
        // @ts-ignore
        cy.spy(client, 'mutate').as('mutate')
      })
    // have the application make the call by using the UI
    cy.get('.new-todo')
      .type('Test!!!!{enter}')
      // note the "function () { ... }" syntax is used to
      // make sure the "this" points at the test context object
      .then(function () {
        // confirm the call has happened with expected variables
        // by now the client.mutate has been called,
        // and the alias has been set (no retries for here)
        expect(this.mutate).to.have.been.calledOnce
        expect(this.mutate.firstCall.args[0].variables)
          .to.deep.include({
            title: 'Test!!!!',
          })
          .and.to.have.property('id')
      })
  })
})
