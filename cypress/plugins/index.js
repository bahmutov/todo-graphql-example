module.exports = (on, config) => {
  // optional: register cypress-grep plugin code
  // https://github.com/bahmutov/cypress-grep
  require('cypress-grep/src/plugin')(config)

  // shared data across specs
  // https://github.com/bahmutov/cypress-data-session
  require('cypress-data-session/src/plugin')(on, config)

  // https://github.com/bahmutov/cypress-timestamps
  require('cypress-timestamps/plugin')(on)

  // make sure to return the config object
  // as it might have been modified by the plugin
  return config
}
