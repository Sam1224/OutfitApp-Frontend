/**
 * @Author: Sam
 * @Date: 2020/4/18
 * @Version: 1.0
 **/
/* eslint-disable */
const config = require('../../config/config')
let url = '/admin/login'
let apiBaseUrl = config.apiBaseUrl

describe ('Test edit admin page of the backend ui', () => {
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
          let [a1, a2, ...rest] = admins
          let two = [a1, a2]
          two.forEach(admin => {
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
    cy.get('.login-table')
      .get('.username')
      .type('admin')
    cy.get('.login-table')
      .get('.password')
      .type('admin')
    cy.get('.login-table')
      .get('.submit')
      .click()
    cy.wait(3000)
    cy.get('.index')
      .get('.nav-wrapper')
      .find('.nav-item')
      .eq(2)
      .click()
    cy.wait(3000)
    cy.get('tbody')
      .find('tr')
      .eq(1)
      .find('td')
      .eq(5)
      .click()
  })
  describe('Content', () => {
    describe('Admin form', () => {
      it('shows a admin form with a title, 4 input boxes and 2 buttons', () => {
        cy.get('.edit-wrapper')
          .get('.title')
          .should('contain', 'Edit Admin')
        cy.get('.edit-wrapper')
          .get('.admin-table')
          .should('contain', 'Username')
        cy.get('.edit-wrapper')
          .get('.admin-table')
          .should('contain', 'Phone')
        cy.get('.edit-wrapper')
          .get('.admin-table')
          .should('contain', 'Email')
        cy.get('.edit-wrapper')
          .get('.admin-table')
          .should('contain', 'Password')
        cy.get('.edit-wrapper')
          .get('.admin-table')
          .should('contain', 'Edit Admin')
        cy.get('.edit-wrapper')
          .get('.admin-table')
          .should('contain', 'Cancel')
      })
    })
  })
  describe('Function', () => {
    describe('Edit', () => {
      describe('Basic information', () => {
        it('successfully updates basic information', () => {
          let userTable = cy.get('.edit-wrapper').get('.admin-table')
          userTable.get('.password')
            .within(() => {
              cy.get('input')
                .clear()
                .type('123456')
            })
          userTable.get('.edit-btn')
            .click()
          cy.screenshot('backend-edit-admin-basic')
          cy.wait(1000)
          cy.get('.index')
            .get('.nav-wrapper')
            .find('.nav-item')
            .eq(2)
            .click()
          cy.wait(3000)
        })
      })
    })
    describe('Cancel', () => {
      it('redirects to the admins list page and leaves the admins list unchanged when cancel is clicked', () => {
        cy.get('.edit-wrapper')
          .get('.admin-table')
          .get('.cancel-btn')
          .click()
        cy.wait(3000)
        cy.get('tbody')
          .find('tr')
          .should('have.length', 2)
      })
    })
  })
})
