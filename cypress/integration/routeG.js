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
 * - [ ] add option to pass unstubbed requests to the server
 *
 * Note: only call this once per test
 */
export const routeG = (operations, options = {}) => {
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

      if (typeof operationHandler === 'function') {
        return operationHandler(req, body)
      } else {
        // we have a response stub
        if (Array.isArray(operationHandler)) {
          console.log('response stubs')
          if (operationHandler.length === 0) {
            throw new Error(
              `Cannot find a response for stubbed operation ${body.operationName}`,
            )
          }
          // pop the first response from the list and return it
          const data = operationHandler.shift()
          return req.reply({
            ...options,
            body: {
              data,
            },
          })
        } else {
          console.log('single response stub')
          return req.reply({
            ...options,
            body: {
              data: operationHandler,
            },
          })
        }
      }
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

/**
 * If every routeG call uses the same options,
 * this wrapper allows you to create custom routeG call
 */
export const initRouteG = (options = {}) => {
  return function customRouteG(operations, customOptions) {
    const mergedOptions = { ...options, ...customOptions }
    return routeG(operations, mergedOptions)
  }
}
