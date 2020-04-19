/**
 * @Author: Sam
 * @Date: 2020/4/19
 * @Version: 1.0
 **/
/* eslint-disable */
const config = require('../../config/config')
let url = '/login'
let apiBaseUrl = config.apiBaseUrl

describe ('Test edit user page of the frontend ui', () => {
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
    cy.get('.login-form')
      .get('.username')
      .type('user1')
    cy.get('.login-form')
      .get('.password')
      .type('123456')
    cy.get('.login-form')
      .get('.submit')
      .click()
    cy.wait(3000)
    cy.get('.footer')
      .within(() => {
        cy.get('.footer-item')
          .eq(4)
          .within(() => {
            cy.get('.el-icon-s-custom')
              .click()
          })
      })
    cy.wait(3000)
    cy.get('.edit')
      .click()
    cy.wait(3000)
  })
  describe('Content', () => {
    describe('User form', () => {
      it('shows a title and a table of user information', () => {
        cy.get('.user-edit')
          .get('.header')
          .should('contain', 'Edit User')
        let userTable = cy.get('.user-table')
        userTable.should('contain', 'Avatar')
        userTable.should('contain', 'Username')
        userTable.should('contain', 'Phone')
        userTable.should('contain', 'Email')
        userTable.should('contain', 'Password')
        userTable.should('contain', 'Name')
        userTable.should('contain', 'Submit')
      })
    })
  })
  describe('Function', () => {
    describe('Edit', () => {
      describe('Basic information', () => {
        it('successfully updates basic information except avatar', () => {
          let userTable = cy.get('.user-table')
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
          cy.screenshot('frontend-edit-user-basic')
          cy.wait(1000)
          cy.url().should('contain', '/home')
        })
      })
      describe('Upload avatar', () => {
        it('successfully updates avatar', () => {
          let userTable = cy.get('.user-table')
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
          cy.screenshot('frontend-edit-user-avatar')
          cy.wait(15000)
          userTable.get('.edit-btn')
            .click()
        })
      })
    })
  })
})
