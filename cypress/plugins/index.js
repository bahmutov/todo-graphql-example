module.exports = (on, config) => {
  // optional: register cypress-grep plugin code
  // https://github.com/bahmutov/cypress-grep
  require('cypress-grep/src/plugin')(config)

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

  // make sure to return the config object
  // as it might have been modified by the plugin
  return config
}
