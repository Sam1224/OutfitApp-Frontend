/**
 * @Author: Sam
 * @Date: 2020/4/18
 * @Version: 1.0
 **/
/* eslint-disable */
const config = require('../../config/config')
let url = '/admin/login'
let apiBaseUrl = config.apiBaseUrl

describe ('Test admins list page of the backend ui', () => {
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
  })
  describe('Content', () => {
    describe('Admins table', () => {
      it('shows an admins table with a title, admin items and a button', () => {
        cy.get('.adminslist-wrapper')
          .get('.vue-title')
          .should('contain', 'Admin List')
        cy.get('tbody')
          .find('tr')
          .should('have.length', 2)
        cy.get('.adminslist-wrapper')
          .get('.admins-table')
          .get('.tab-wrapper')
          .get('.tab-item')
          .get('.add')
          .should('contain', 'Add Admin')
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
      })
    })
    describe('Redirection', () => {
      it('redirects to add admin page when add admin is clicked', () => {
        cy.wait(1000)
        cy.get('.adminslist-wrapper')
          .get('.admins-table')
          .get('.tab-wrapper')
          .get('.tab-item')
          .get('.add')
          .click()
        cy.url()
          .should('contain', '/admin/admins/add')
      })
      it('redirects to edit admin page when edit admin is clicked', () => {
        cy.wait(1000)
        cy.get('tbody')
          .find('tr')
          .eq(0)
          .find('td')
          .eq(5)
          .click()
        cy.url()
          .should('contain', '/admin/admins/edit')
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
        cy.screenshot('backend-admin-delete-cancel')
        cy.get('button')
          .contains('Cancel')
          .click()
        cy.get('tbody')
          .find('tr')
          .should('have.length', 2)
      })
      it('successfully deletes one admin when the deletion is confirmed', () => {
        cy.wait(1000)
        cy.get('tbody')
          .find('tr')
          .eq(1)
          .find('td')
          .eq(6)
          .click()
        cy.screenshot('backend-admin-delete-confirm')
        cy.get('button')
          .contains('Delete')
          .click()
        cy.get('tbody')
          .find('tr')
          .should('have.length', 1)
      })
    })
  })
})
