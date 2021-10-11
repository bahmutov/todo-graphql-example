// @ts-check

describe('Adding header', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'POST',
        url: '/',
        middleware: true,
      },
      (req) => {
        console.log('operationName: %s', req.body.operationName)
        req.headers['x-intercept-operation'] = req.body.operationName
      },
    ).as('posted')
  })

  it('intercepts operations using header added above', () => {
    cy.intercept({
      method: 'POST',
      url: '/',
      headers: {
        // "x-gql-operation-name" is added by the Apollo Client
        // and matching by it works
        // 'x-gql-operation-name': 'allTodos',

        // "x-intercept-operation" is added by the intercept middleware above
        // and this matcher does not work
        'x-intercept-operation': 'allTodos',
      },
    }).as('allTodos')

    cy.visit('/')
    cy.wait('@allTodos')
  })
})
