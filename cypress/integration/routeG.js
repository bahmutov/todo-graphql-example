/// <reference types="cypress" />

/**
 * Registers a single cy.route2 handler that specifically is suited for GraphQL calls.
 * Spies and records the requests and responses using "operationName" field of the call.
 *
 * Overall design goal:
 * - making JSON parsing built-in
 * - making stubbing responses really easy
 * - record requests automatically
 * - provide a way to record responses
 *
 * Note: only call this once per test
 */
export const routeG = (operations) => {
  const requests = {}
  const responses = {}

  const names = Object.keys(operations)
  names.forEach((operationName) => {
    requests[operationName] = []
    responses[operationName] = []
  })

  cy.log(`routeG **${names.join(', ')}**`)
  cy.route2(
    {
      method: 'POST',
    },
    (req) => {
      const body = JSON.parse(req.body)

      const operationHandler = operations[body.operationName]
      if (!operationHandler) {
        console.log('no handler for operation %s', body.operationName)
        return
      }
      console.log('handling operation %s', body.operationName)
      requests[body.operationName].push(body)

      return operationHandler(req, body)
    },
  )

  const saveResponse = (operationName, req) => {
    expect(responses).to.have.property(operationName)

    req.reply((res) => {
      const serverResponse = JSON.parse(res.body)
      responses[operationName].push(serverResponse)
    })
  }
  return { requests, responses, saveResponse }
}
