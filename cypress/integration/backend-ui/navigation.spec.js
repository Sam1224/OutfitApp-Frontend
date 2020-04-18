/**
 * @Author: Sam
 * @Date: 2020/4/18
 * @Version: 1.0
 **/
/* eslint-disable */
const config = require('../../config/config')
let url = '/admin/login'
let apiBaseUrl = config.apiBaseUrl

describe ('Test navigation bar of the backend ui', () => {
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
    describe('Navigation bar', () => {
      it('shows 1 arrow icon and 4 router links when not logined', () => {
        cy.get('.index')
          .get('.nav-wrapper')
          .get('.info-btn')
        cy.get('.index')
          .get('.nav-wrapper')
          .find('.nav-item')
          .should('have.length', 4)
        cy.get('.index')
          .get('.nav-wrapper')
          .within(() => {
            cy.get('.nav-item')
              .eq(0)
              .should('contain', 'Home')
            cy.get('.nav-item')
              .eq(1)
              .should('contain', 'Users')
            cy.get('.nav-item')
              .eq(2)
              .should('contain', 'Admins')
            cy.get('.nav-item')
              .eq(3)
              .should('contain', 'Login')
          })
      })
      it('shows 1 arrow icon, 4 router links and an avatar with name when already logined', () => {
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
          .get('.info-btn')
        cy.get('.index')
          .get('.nav-wrapper')
          .find('.nav-item')
          .should('have.length', 4)
        cy.get('.index')
          .get('.nav-wrapper')
          .within(() => {
            cy.get('.nav-item')
              .eq(0)
              .should('contain', 'Home')
            cy.get('.nav-item')
              .eq(1)
              .should('contain', 'Users')
            cy.get('.nav-item')
              .eq(2)
              .should('contain', 'Admins')
            cy.get('.nav-item')
              .eq(3)
              .should('contain', 'Logout')
            cy.get('.avatar')
            cy.get('.name')
              .should('contain', 'admin')
          })
      })
    })
  })
  describe('Function', () => {
    describe('Drawer', () => {
      it('opens the drawer from the left side when the icon button is clicked', () => {
        cy.get('.index')
          .get('.nav-wrapper')
          .get('.info-btn')
          .click()
        cy.get('.index')
          .get('.drawer-wrapper')
          .get('.content')
          .should('contain', 'Custom Outfit App - Backend')

        cy.screenshot('backend-open-drawer')
      })
    })
    describe('Redirection', () => {
      describe('Already logined', () => {
        beforeEach(() => {
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
        })
        it('redirects to the home page when home is clicked', () => {
          cy.get('.index')
            .get('.nav-wrapper')
            .find('.nav-item')
            .eq(0)
            .click()
          cy.wait(3000)
          cy.url().should('contain', '/admin/home')
        })
        it('redirects to the users page when users is clicked', () => {
          cy.get('.index')
            .get('.nav-wrapper')
            .find('.nav-item')
            .eq(1)
            .click()
          cy.wait(3000)
          cy.url().should('contain', '/admin/users')
        })
        it('redirects to the sellers page when sellers is clicked', () => {
          cy.get('.index')
            .get('.nav-wrapper')
            .find('.nav-item')
            .eq(2)
            .click()
          cy.wait(3000)
          cy.url().should('contain', '/admin/admins')
        })
      })
      describe('Not logined', () => {
        it('redirects to the login page when home is clicked', () => {
          cy.get('.index')
            .get('.nav-wrapper')
            .find('.nav-item')
            .eq(0)
            .click()
          cy.wait(3000)
          cy.url().should('contain', '/admin')
        })
        it('redirects to the login page when users is clicked', () => {
          cy.get('.index')
            .get('.nav-wrapper')
            .find('.nav-item')
            .eq(1)
            .click()
          cy.wait(3000)
          cy.url().should('contain', '/admin')
        })
        it('redirects to the login page when sellers is clicked', () => {
          cy.get('.index')
            .get('.nav-wrapper')
            .find('.nav-item')
            .eq(2)
            .click()
          cy.wait(3000)
          cy.url().should('contain', '/admin')
        })
        it('logout and redirects to the login page when login is clicked', () => {
          cy.get('.index')
            .get('.nav-wrapper')
            .find('.nav-item')
            .eq(3)
            .click()
          cy.wait(3000)
          cy.url().should('contain', '/admin/login')
        })
      })
    })
  })
})
