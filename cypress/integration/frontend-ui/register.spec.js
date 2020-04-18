/**
 * @Author: Sam
 * @Date: 2020/4/18
 * @Version: 1.0
 **/
/* eslint-disable */
const config = require('../../config/config')
let url = '/login'
let apiBaseUrl = config.apiBaseUrl

describe ('Test register page of the frontend ui', () => {
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
    cy.get('.register')
      .click()
    cy.wait(3000)
  })
  describe('Content', () => {
    describe('Register form', () => {
      it('shows a title, 6 input boxes, 2 buttons and 1 router link', () => {
        cy.get('#register')
          .get('.header')
          .should('contain', 'Register')
        let regForm = cy.get('.reg-form')
        regForm.should('contain', 'Username')
        regForm.should('contain', 'Password')
        regForm.should('contain', 'Confirm Password')
        regForm.should('contain', 'Phone')
        regForm.should('contain', 'Email')
        regForm.should('contain', 'Name')
        regForm.get('.submit')
          .should('contain', 'Register')
        regForm.get('.cancel')
          .should('contain', 'Cancel')
        regForm.get('.login')
          .should('contain', 'Already Registered？Login Now')
      })
    })
  })
  describe('Function', () => {
    describe('Register', () => {
      it('registers successfully', () => {
        let regForm = cy.get('.reg-form')
        regForm.get('.username')
          .type('sam1224')
        regForm.get('.password')
          .type('123456')
        regForm.get('.confirm-password')
          .type('123456')
        regForm.get('.phone')
          .type('15906880272')
        regForm.get('.email')
          .type('18362096380@163.com')
        regForm.get('.name')
          .type('CXL')
        regForm.get('.submit')
          .click()
        cy.screenshot('frontend-register-success')
        cy.wait(3000)
        cy.url()
          .should('contain', '/login')
      })
    })
    describe('Redirection', () => {
      it('should redirect to login page when login is clicked', () => {
        cy.get('.login')
          .click()
        cy.wait(3000)
        cy.url().should('contain', '/login')
      })
      it('should redirect to login page when cancel is clicked', () => {
        cy.get('.cancel')
          .click()
        cy.wait(3000)
        cy.url().should('contain', '/login')
      })
    })
  })
})
