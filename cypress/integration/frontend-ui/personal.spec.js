/**
 * @Author: Sam
 * @Date: 2020/4/18
 * @Version: 1.0
 **/
/* eslint-disable */
const config = require('../../config/config')
let url = '/login'
let apiBaseUrl = config.apiBaseUrl

describe ('Test personal page of the frontend ui', () => {
  before(() => {
    // Get token
    let token = null
    cy.request(`${apiBaseUrl}/admin/token/admin`)
      .its('body')
      .then((res) => {
        expect(res.code).to.equal(0)
        expect(res.message).to.equal('Successfully login, use your token')
        token = res.token

        // Reset users
        cy.request(`${apiBaseUrl}/user`)
          .its('body')
          .then((res) => {
            expect(res.code).to.equal(0)
            res.data.forEach((user) => {
              cy.request('DELETE', `${apiBaseUrl}/user/${user._id}`, {token: token})
            })
          })

        cy.fixture("users").then(users => {
          let [u1, ...rest] = users
          let one = [u1]
          one.forEach(user => {
            cy.request('POST', `${apiBaseUrl}/user`, user)
              .then((res) => {
                // Activate account
                cy.request(`${apiBaseUrl}/token/${u1.username}`)
                  .its('body')
                  .then((res) => {
                    expect(res.code).to.equal(0)
                    expect(res.message).to.equal('Successfully login, use your token')
                    cy.request(`${apiBaseUrl}/activateAccount?username=${u1.username}&token=${res.token}`)
                  })
              })
          })
        })

        // Reset vton
        cy.request(`${apiBaseUrl}/user`)
          .its('body')
          .then((res) => {
            expect(res.code).to.equal(0)
            res.data.forEach((user) => {
              cy.fixture("vton").then(vtons => {
                let [v1, ...rest] = vtons
                v1._id = user._id
                v1.username = user.username
                cy.request('POST', `${apiBaseUrl}/user/vton/add`, v1)
              })
            })
          })

        // Reset retrieval
        cy.request(`${apiBaseUrl}/user`)
          .its('body')
          .then((res) => {
            expect(res.code).to.equal(0)
            res.data.forEach((user) => {
              cy.fixture("retrieval").then(retrievals => {
                let [r1, ...rest] = retrievals
                r1._id = user._id
                r1.username = user.username
                cy.request('POST', `${apiBaseUrl}/user/retrieval/add`, r1)
              })
            })
          })
      })
  })
  beforeEach(() => {
    cy.visit(url)
    cy.get('.login-form')
      .get('.username')
      .type('user1')
    cy.get('.login-form')
      .get('.password')
      .type('123456')
    cy.get('.login-form')
      .get('.submit')
      .click()
    cy.wait(3000)
    cy.get('.footer')
      .within(() => {
        cy.get('.footer-item')
          .eq(4)
          .within(() => {
            cy.get('.el-icon-s-custom')
              .click()
          })
      })
    cy.wait(3000)
  })
  describe('Content', () => {
    describe('User form', () => {
      it('shows a title and a table of user information', () => {
        cy.get('.personal')
          .get('.header')
          .should('contain', 'Personal')
        cy.get('.content-wrapper')
          .get('.avatar')
        cy.get('.content-wrapper')
          .get('.text')
          .should('contain', 'Qianxiong Xu 1')
        cy.get('.content-wrapper')
          .get('.edit-btn')
        cy.get('.content-wrapper')
          .should('contain', 'Username')
        cy.get('.content-wrapper')
          .should('contain', 'Name')
        cy.get('.content-wrapper')
          .should('contain', 'Phone')
        cy.get('.content-wrapper')
          .should('contain', 'Email')
        cy.get('.content-wrapper')
          .should('contain', 'Virtual Try-On')
        cy.get('.content-wrapper')
          .should('contain', 'Outfits Retrieval')
      })
    })
  })
  describe('Function', () => {
    describe('Redirection', () => {
      it('should redirect to the user edit page when the edit icon is clicked', () => {
        cy.get('.edit-btn')
          .get('.edit')
          .click()
        cy.wait(3000)
        cy.url().should('contain', 'user-edit')
      })
      it('should redirect to the vton list page when the vton row is clicked', () => {
        cy.get('.vton-row')
          .click()
        cy.wait(3000)
        cy.url().should('contain', 'vton-list')
      })
      it('should redirect to the retrieval list page when the retrieval row is clicked', () => {
        cy.get('.retrieval-row')
          .click()
        cy.wait(3000)
        cy.url().should('contain', 'retrieval-list')
      })
    })
  })
})
