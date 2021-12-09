// adds "describe.each" and "it.each" helpers
// https://github.com/bahmutov/cypress-each
require('cypress-each')

// https://github.com/bahmutov/cypress-grep
require('cypress-grep')()

// https://github.com/bahmutov/cypress-timestamps
require('cypress-timestamps/support')({
  terminal: true,
  error: true,
  commandLog: true,
})
