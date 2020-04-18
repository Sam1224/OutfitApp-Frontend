/**
 * @Author: Sam
 * @Date: 2020/4/18
 * @Version: 1.0
 **/
/* eslint-disable */
const config = require('../../config/config')
let url = '/admin/login'
let apiBaseUrl = config.apiBaseUrl

describe ('Test users list page of the backend ui', () => {
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
  })
  describe('Content', () => {
    describe('Users table', () => {
      it('shows a users table with a title, user items and a button', () => {
        cy.get('.userslist-wrapper')
          .get('.vue-title')
          .should('contain', 'User List')
        cy.get('tbody')
          .find('tr')
          .should('have.length', 1)
        cy.get('.userslist-wrapper')
          .get('.users-table')
          .get('.tab-wrapper')
          .get('.tab-item')
          .get('.add')
          .should('contain', 'Add User')
      })
    })
  })
  describe('Function', () => {
    describe('A detailed form in child row', () => {
      it('shows a child row when the symbol + is clicked', () => {
        cy.get('tbody')
          .find('tr')
          .eq(0)
          .find('td')
          .eq(0)
          .click()
        cy.get('tbody')
          .find('tr')
          .eq(1)
          .should('contain', 'Username')
        cy.get('tbody')
          .find('tr')
          .eq(1)
          .should('contain', 'Phone')
        cy.get('tbody')
          .find('tr')
          .eq(1)
          .should('contain', 'Email')
        cy.get('tbody')
          .find('tr')
          .eq(1)
          .should('contain', 'Name')
        cy.get('tbody')
          .find('tr')
          .eq(1)
          .should('contain', 'Avatar')
        cy.get('tbody')
          .find('tr')
          .eq(1)
          .should('contain', 'VTON')
        cy.get('tbody')
          .find('tr')
          .eq(1)
          .should('contain', 'Retrieval')
      })
    })
    describe('Redirection', () => {
      it('redirects to add user page when add user is clicked', () => {
        cy.wait(1000)
        cy.get('.userslist-wrapper')
          .get('.users-table')
          .get('.tab-wrapper')
          .get('.tab-item')
          .get('.add')
          .click()
        cy.url()
          .should('contain', '/admin/users/add')
      })
      it('redirects to edit user page when edit user is clicked', () => {
        cy.wait(1000)
        cy.get('tbody')
          .find('tr')
          .eq(0)
          .find('td')
          .eq(5)
          .click()
        cy.url()
          .should('contain', '/admin/users/edit')
      })
    })
    describe('Delete', () => {
      it('leaves the list unchanged when the deletion is canceled', () => {
        cy.wait(1000)
        cy.get('tbody')
          .find('tr')
          .eq(0)
          .find('td')
          .eq(6)
          .click()
        cy.screenshot('backend-user-delete-cancel')
        cy.get('button')
          .contains('Cancel')
          .click()
        cy.get('tbody')
          .find('tr')
          .should('have.length', 1)
      })
      it('successfully deletes one user when the deletion is confirmed', () => {
        cy.wait(1000)
        cy.get('tbody')
          .find('tr')
          .eq(0)
          .find('td')
          .eq(6)
          .click()
        cy.screenshot('backend-user-delete-confirm')
        cy.get('button')
          .contains('Delete')
          .click()
        cy.get('tbody')
          .find('tr')
          .should('have.length', 1)
        cy.get('tbody')
          .find('tr')
          .eq(0)
          .should('contain', 'No matching records')
      })
    })
  })
})
