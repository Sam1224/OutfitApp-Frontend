/**
 * @Author: Sam
 * @Date: 2020/4/18
 * @Version: 1.0
 **/
/* eslint-disable */
const config = require('../../config/config')
let url = '/login'
let apiBaseUrl = config.apiBaseUrl

describe ('Test login page of the frontend ui', () => {
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
  })
  describe('Content', () => {
    describe('Login form', () => {
      it('shows a title, 2 input boxes, 2 buttons and 1 router link', () => {
        cy.get('.login')
          .get('.header')
          .should('contain', 'Login')
        let loginForm = cy.get('.login-form')
        loginForm.should('contain', 'Username')
        loginForm.should('contain', 'Password')
        loginForm.get('.submit')
          .should('contain', 'Login')
        loginForm.get('.cancel')
          .should('contain', 'Cancel')
        loginForm.get('.register')
          .should('contain', 'No account? Register now')
      })
    })
  })
  describe('Function', () => {
    describe('Login', () => {
      it('logins successfully', () => {
        let loginForm = cy.get('.login-form')
        loginForm.get('.username')
          .type('user1')
        loginForm.get('.password')
          .type('123456')
        loginForm.get('.submit')
          .click()
        cy.screenshot('frontend-login-success')
        cy.wait(3000)
        cy.url()
          .should('contain', '/home')
        cy.get('.home')
          .get('.header-wrapper')
          .should('contain', 'Custom Outfit App')
      })
    })
    describe('Redirection', () => {
      it('should redirect to register page when register is clicked', () => {
        cy.get('.register')
          .click()
        cy.wait(3000)
        cy.url().should('contain', '/register')
      })
      it('should redirect to home page when cancel is clicked', () => {
        cy.get('.cancel')
          .click()
        cy.wait(3000)
        cy.url().should('contain', '/home')
      })
    })
  })
})
