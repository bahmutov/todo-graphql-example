// @ts-check
/// <reference types="cypress" />

import { data } from '../fixtures/three.json'
import { deleteAll } from './utils'

describe('Creates each item', () => {
  beforeEach(deleteAll)

  // use the imported items to create each item
  // then verify the application shows it
  it('in a single test', () => {
    cy.fixture('three.json')
      .its('data.allTodos')
      .then((list) => {
        list.forEach((item) => {
          // clear all existing items
          deleteAll()

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
})
