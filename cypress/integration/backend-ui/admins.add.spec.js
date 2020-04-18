/**
 * @Author: Sam
 * @Date: 2020/4/18
 * @Version: 1.0
 **/
/* eslint-disable */
const config = require('../../config/config')
let url = '/admin/login'
let apiBaseUrl = config.apiBaseUrl

describe ('Test add admin page of the backend ui', () => {
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
    cy.get('.adminslist-wrapper')
      .get('.admins-table')
      .get('.tab-wrapper')
      .get('.tab-item')
      .get('.add')
      .click()
  })
  describe('Content', () => {
    describe('Admin form', () => {
      it('shows a admin form with a title, 4 input boxes and 3 buttons', () => {
        cy.get('.add-wrapper')
          .get('.title')
          .should('contain', 'Add Admin')
        cy.get('.add-wrapper')
          .get('.admin-table')
          .should('contain', 'Username')
        cy.get('.add-wrapper')
          .get('.admin-table')
          .should('contain', 'Password')
        cy.get('.add-wrapper')
          .get('.admin-table')
          .should('contain', 'Phone')
        cy.get('.add-wrapper')
          .get('.admin-table')
          .should('contain', 'Email')
        cy.get('.add-wrapper')
          .get('.admin-table')
          .should('contain', 'Add Admin')
        cy.get('.add-wrapper')
          .get('.admin-table')
          .should('contain', 'Reset')
        cy.get('.add-wrapper')
          .get('.admin-table')
          .should('contain', 'Cancel')
      })
    })
  })
  describe('Function', () => {
    describe('Add', () => {
      it('successfully add one admin', () => {
        let userTable = cy.get('.add-wrapper').get('.admin-table')
        userTable.get('.username')
          .type('YingfeiXu')
        userTable.get('.password')
          .type('123456')
        userTable.get('.phone')
          .type('13606699959')
        userTable.get('.email')
          .type('18362096380@163.com')
        userTable.get('.add-btn')
          .click()
        cy.screenshot('backend-add-admin')
        cy.wait(3000)
        cy.get('tbody')
          .find('tr')
          .should('have.length', 2)
      })
      it('fails to add one admin when the input is invalid', () => {
        let userTable = cy.get('.add-wrapper').get('.admin-table')
        userTable.get('.username')
          .type('YFX')
        userTable.get('.password')
          .type('123456')
        userTable.get('.phone')
          .type('13606699959')
        userTable.get('.email')
          .type('18362096380@163.com')
        userTable.get('.add-btn')
          .click()
        cy.screenshot('backend-add-admin-err')
        cy.get('.el-form-item__error')
          .should('contain', 'The length of username should be at least 5 characters')
        cy.wait(1000)
        cy.get('.index')
          .get('.nav-wrapper')
          .find('.nav-item')
          .eq(2)
          .click()
        cy.wait(3000)
        cy.get("tbody")
          .find("tr")
          .should("have.length", 2)

      })
      it('cleans the admin table when reset is clicked', () => {
        let userTable = cy.get('.add-wrapper').get('.admin-table')
        userTable.get('.username')
          .type('YingfeiXu')
        userTable.get('.password')
          .type('123456')
        userTable.get('.phone')
          .type('13606699959')
        userTable.get('.email')
          .type('18362096380@163.com')
        userTable.get('.reset-btn')
          .click()
        userTable.get('.username')
          .should('have.value', '')
        userTable.get('.password')
          .should('have.value', '')
        userTable.get('.phone')
          .should('have.value', '')
        userTable.get('.email')
          .should('have.value', '')
      })
    })
    describe('Cancel', () => {
      it('redirects to the admins list page and leaves the admins list unchanged when cancel is clicked', () => {
        cy.get('.add-wrapper')
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
