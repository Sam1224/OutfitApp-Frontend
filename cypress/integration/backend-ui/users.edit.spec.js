/**
 * @Author: Sam
 * @Date: 2020/4/18
 * @Version: 1.0
 **/
/* eslint-disable */
const config = require('../../config/config')
let url = '/admin/login'
let apiBaseUrl = config.apiBaseUrl

describe ('Test edit user page of the backend ui', () => {
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
    cy.get('tbody')
      .find('tr')
      .eq(0)
      .find('td')
      .eq(5)
      .click()
  })
  describe('Content', () => {
    describe('User form', () => {
      it('shows a user form with a title, 5 input boxes, 1 image uploader and 2 buttons', () => {
        cy.get('.edit-wrapper')
          .get('.title')
          .should('contain', 'Edit User')
        cy.get('.edit-wrapper')
          .get('.user-table')
          .should('contain', 'Username')
        cy.get('.edit-wrapper')
          .get('.user-table')
          .should('contain', 'Phone')
        cy.get('.edit-wrapper')
          .get('.user-table')
          .should('contain', 'Email')
        cy.get('.edit-wrapper')
          .get('.user-table')
          .should('contain', 'Password')
        cy.get('.edit-wrapper')
          .get('.user-table')
          .should('contain', 'Name')
        cy.get('.edit-wrapper')
          .get('.user-table')
          .should('contain', 'Avatar')
        cy.get('.edit-wrapper')
          .get('.user-table')
          .should('contain', 'Edit User')
        cy.get('.edit-wrapper')
          .get('.user-table')
          .should('contain', 'Cancel')
      })
    })
  })
  describe('Function', () => {
    describe('Edit', () => {
      describe('Basic information', () => {
        it('successfully updates basic information except avatar', () => {
          let userTable = cy.get('.edit-wrapper').get('.user-table')
          userTable.get('.password')
            .within(() => {
              cy.get('input')
                .clear()
                .type('123456')
            })
          userTable.get('.name')
            .within(() => {
              cy.get('input')
                .clear()
                .type('XSam981212')
            })
          userTable.get('.edit-btn')
            .click()
          cy.screenshot('backend-edit-user-basic')
          cy.wait(1000)
          cy.get('.index')
            .get('.nav-wrapper')
            .find('.nav-item')
            .eq(1)
            .click()
          cy.wait(3000)
          cy.get("tbody")
            .find("tr")
            .eq(0)
            .find("td")
            .eq(3)
            .should('contain', "XSam981212")
        })
      })
      describe('Upload avatar', () => {
        it('successfully updates avatar', () => {
          let userTable = cy.get('.edit-wrapper').get('.user-table')
          let fileName = 'avatar.jpg'
          cy.fixture(fileName).then(fileContent => {
            cy.get('.upload-wrapper')
              .eq(0)
              .within(() => {
                cy.get('.el-upload__input')
                  .upload({
                    fileContent,
                    fileName,
                    mimeType: 'image/jpeg'
                  })
              })
          })
          cy.screenshot('backend-edit-user-avatar')
          cy.wait(15000)
          userTable.get('.edit-btn')
            .click()
          cy.get('.index')
            .get('.nav-wrapper')
            .find('.nav-item')
            .eq(1)
            .click()
          cy.wait(3000)
          cy.get("tbody")
            .find("tr")
            .eq(0)
            .find("td")
            .eq(3)
            .should('contain', "XSam981212")
        })
      })
    })
    describe('Cancel', () => {
      it('redirects to the users list page and leaves the users list unchanged when cancel is clicked', () => {
        cy.get('.edit-wrapper')
          .get('.user-table')
          .get('.cancel-btn')
          .click()
        cy.wait(3000)
        cy.get('tbody')
          .find('tr')
          .should('have.length', 1)
      })
    })
  })
})
