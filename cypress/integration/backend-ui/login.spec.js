/**
 * @Author: Sam
 * @Date: 2020/4/18
 * @Version: 1.0
 **/
/* eslint-disable */
const config = require('../../config/config')
let url = '/admin/login'
let apiBaseUrl = config.apiBaseUrl

describe ('Test login page of the backend ui', () => {
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
          })
        })

        // Reset admins
        let headers = {token: token}
        cy.request({
          method: 'GET',
          url: `${apiBaseUrl}/admin`,
          headers: headers
        })
          .its('body')
          .then((res) => {
            expect(res.code).to.equal(0)
            res.data.forEach((admin) => {
              cy.request('DELETE', `${apiBaseUrl}/admin/${admin._id}`, {token: token})
            })
          })

        cy.fixture("admins").then(admins => {
          let [a1, ...rest] = admins
          let one = [a1]
          one.forEach(admin => {
            cy.request('POST', `${apiBaseUrl}/admin`, admin)
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
    describe('Login table', () => {
      it('shows a login table with a title, 2 input boxes, 1 button and 6 3rd party oauth2 login buttons', () => {
        cy.get('.vue-title')
          .should('contain', 'Login')
        let loginTable = cy.get('.login-table')
        loginTable.should('contain', 'Username')
        loginTable.should('contain', 'Password')
        loginTable.should('contain', 'Login')
        loginTable.should('contain', 'OtherLogin')
        loginTable.get('.icon-wrapper')
          .find('.icon')
          .should('have.length', 6)
      })
    })
  })
  describe('Function', () => {
    describe('Login', () => {
      it('logins successfully', () => {
        cy.get('.login-table')
          .get('.username')
          .type('admin')
        cy.get('.login-table')
          .get('.password')
          .type('admin')
        cy.get('.login-table')
          .get('.submit')
          .click()
        cy.screenshot('backend-login-success')
        cy.wait(3000)
        cy.url()
          .should('contain', '/admin')
        cy.get('.index')
          .get('.content-wrapper')
          .get('.vue-title')
          .should('contain', 'Welcome to the Backend of Custom Outfit App!')
      })
    })
  })
})
