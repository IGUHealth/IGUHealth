/* global window */

const CI_TENANT_ID = Cypress.env('CI_TENANT_ID')

describe('example: yarn-modern', () => {
  it('loads the deployed site', () => {
    cy.visit(`http://${CI_TENANT_ID}.localhost:3001/`)
    cy.wait(5000)
  })
})
