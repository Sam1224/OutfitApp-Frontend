/**
 * @Author: Sam
 * @Date: 2020/4/18
 * @Version: 1.0
 **/
/* eslint-disable */
const config = require('../../config/config')
let url = '/admin/login'
let apiBaseUrl = config.apiBaseUrl

describe ('Test add user page of the backend ui', () => {
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
      .eq(1)
      .click()
    cy.wait(3000)
    cy.get('.userslist-wrapper')
      .get('.users-table')
      .get('.tab-wrapper')
      .get('.tab-item')
      .get('.add')
      .click()
    cy.wait(3000)
  })
  describe('Content', () => {
    describe('User form', () => {
      it('shows a user form with a title, 5 input boxes and 3 buttons', () => {
        cy.get('.add-wrapper')
          .get('.title')
          .should('contain', 'Add User')
        cy.get('.add-wrapper')
          .get('.user-table')
          .should('contain', 'Username')
        cy.get('.add-wrapper')
          .get('.user-table')
          .should('contain', 'Password')
        cy.get('.add-wrapper')
          .get('.user-table')
          .should('contain', 'Phone')
        cy.get('.add-wrapper')
          .get('.user-table')
          .should('contain', 'Email')
        cy.get('.add-wrapper')
          .get('.user-table')
          .should('contain', 'Name')
        cy.get('.add-wrapper')
          .get('.user-table')
          .should('contain', 'Add User')
        cy.get('.add-wrapper')
          .get('.user-table')
          .should('contain', 'Reset')
        cy.get('.add-wrapper')
          .get('.user-table')
          .should('contain', 'Cancel')
      })
    })
  })
  describe('Function', () => {
    describe('Add', () => {
      it('successfully add one user', () => {
        let userTable = cy.get('.add-wrapper').get('.user-table')
        userTable.get('.username')
          .type('Yingfei Xu')
        userTable.get('.password')
          .type('123456')
        userTable.get('.phone')
          .type('13606699959')
        userTable.get('.email')
          .type('18362096380@163.com')
        userTable.get('.name')
          .eq(1)
          .type('Chong Feng')
        userTable.get('.add-btn')
          .click()
        cy.screenshot('backend-add-user')
        cy.wait(3000)
        cy.get('tbody')
          .find('tr')
          .should('have.length', 2)
      })
      it('fails to add one user when the input is invalid', () => {
        let userTable = cy.get('.add-wrapper').get('.user-table')
        userTable.get('.username')
          .type('YFX')
        userTable.get('.password')
          .type('123456')
        userTable.get('.phone')
          .type('13606699959')
        userTable.get('.email')
          .type('18362096380@163.com')
        userTable.get('.name')
          .eq(1)
          .type('Chong Feng')
        userTable.get('.add-btn')
          .click()
        cy.screenshot('backend-add-user-err')
        cy.get('.el-form-item__error')
          .should('contain', 'The length of username should be at least 5 characters')
        cy.wait(1000)
        cy.get('.index')
          .get('.nav-wrapper')
          .find('.nav-item')
          .eq(1)
          .click()
        cy.wait(3000)
        cy.get("tbody")
          .find("tr")
          .should("have.length", 2)

      })
      it('cleans the user table when reset is clicked', () => {
        let userTable = cy.get('.add-wrapper').get('.user-table')
        userTable.get('.username')
          .type('Yingfei Xu')
        userTable.get('.password')
          .type('123456')
        userTable.get('.phone')
          .type('13606699959')
        userTable.get('.email')
          .type('18362096380@163.com')
        userTable.get('.name')
          .eq(1)
          .type('Chong Feng')
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
        userTable.get('.name')
          .should('have.value', '')
      })
    })
    describe('Cancel', () => {
      it('redirects to the users list page and leaves the users list unchanged when cancel is clicked', () => {
        cy.get('.add-wrapper')
          .get('.user-table')
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
