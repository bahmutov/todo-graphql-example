// @ts-check

// Type check works for JSON module
// because in "jsconfig.json" file I use "resolveJsonModule: true"
import { data } from '../fixtures/three.json'
import { deleteAll, createItems } from './utils'

// read the blog post https://glebbahmutov.com/blog/dynamic-tests-from-fixture/
// watch the video "Dynamic Tests From Cypress.io Fixture File" https://youtu.be/EXVwvJrUGJ8

describe('Creates each item', { tags: '@dynamic' }, () => {
  beforeEach(deleteAll)

  // use the imported items to create each item
  // then verify the application shows it
  it('in a single test', () => {
    // clear all existing items
    deleteAll()

    cy.fixture('three.json')
      .its('data.allTodos')
      .then((list) => {
        list.forEach((item) => {
          // create the item using a network call
          cy.request({
            method: 'POST',
            url: 'http://localhost:3000/',
            body: {
              operationName: 'AddTodo',
              query: `
              mutation AddTodo($title: String!, $completed: Boolean!) {
                createTodo(title: $title, completed: $completed) {
                  id
                }
              }
            `,
              variables: {
                title: item.title,
                completed: item.completed,
              },
            },
          })
          // visit the page and check the item is present
          cy.visit('/')
          const classAssertion = item.completed
            ? 'have.class'
            : 'not.have.class'
          cy.contains('.todo', item.title).should(classAssertion, 'completed')
        })
      })
  })

  // create a test for each item imported from the fixture
  data.allTodos.forEach((item, k) => {
    it(`creates item ${k + 1}`, () => {
      // create the item using a network call
      cy.request({
        method: 'POST',
        url: 'http://localhost:3000/',
        body: {
          operationName: 'AddTodo',
          query: `
              mutation AddTodo($title: String!, $completed: Boolean!) {
                createTodo(title: $title, completed: $completed) {
                  id
                }
              }
            `,
          variables: {
            title: item.title,
            completed: item.completed,
          },
        },
      })
      // visit the page and check the item is present
      cy.visit('/')
      const classAssertion = item.completed ? 'have.class' : 'not.have.class'
      cy.contains('.todo', item.title).should(classAssertion, 'completed')
    })
  })

  it('creates items', () => {
    createItems(data.allTodos)
    cy.visit('/')
    cy.get('.todo').should('have.length', data.allTodos.length)
  })
})
