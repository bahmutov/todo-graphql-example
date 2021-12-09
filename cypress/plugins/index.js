module.exports = (on, config) => {
  // optional: register cypress-grep plugin code
  // https://github.com/bahmutov/cypress-grep
  require('cypress-grep/src/plugin')(config)

  // shared data across specs
  // https://github.com/bahmutov/cypress-data-session
  require('cypress-data-session/src/plugin')(on, config)

  function getUTC() {
    const now = new Date()
    return now.toISOString()
  }

  on('task', {
    beforeTest(testName) {
      console.log(`=== ${getUTC()} start: ${testName}`)
      // cy.task must return something, cannot return undefined
      return null
    },
    afterTest(testName) {
      console.log(`=== ${getUTC()} end: ${testName}`)
      return null
    },
  })

  // https://on.cypress.io/after-screenshot-api
  on('after:screenshot', ({ testFailure, takenAt }) => {
    if (testFailure) {
      // this is a screenshot taken on test failure
      // not a screenshot from the cy.screenshot command
      // takenAt is a UTC string
      console.log(`xxx ${takenAt} error`)
    }
  })

  // make sure to return the config object
  // as it might have been modified by the plugin
  return config
}
