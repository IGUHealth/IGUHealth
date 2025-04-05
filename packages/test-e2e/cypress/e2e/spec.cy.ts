/* global window */

describe('example: yarn-modern', () => {
  it('loads the deployed site', () => {
    cy.visit('http://dpamtgk6fe2d6c51iro5f.localhost:3001/')
    cy.wait(5000)
  })
})
