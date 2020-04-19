/**
 * @Author: Sam
 * @Date: 2020/4/18
 * @Version: 1.0
 **/
/* eslint-disable */
const config = require('../../config/config')
let url = '/login'
let apiBaseUrl = config.apiBaseUrl

describe ('Test vton diy page of the frontend ui', () => {
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
          .eq(2)
          .within(() => {
            cy.get('.el-icon-circle-plus')
              .click()
          })
      })
    cy.wait(1000)
    cy.get('.add-item')
      .eq(1)
      .within(() => {
        cy.get('.el-icon-s-goods')
          .click()
      })
    cy.wait(3000)
  })
  describe('Content', () => {
    describe('VTON DIY steps', () => {
      it('shows a title and steps of procedures', () => {
        cy.get('.virtual-try-on-diy-wrapper')
          .get('.header')
          .should('contain', 'Virtual Try-On DIY')
        cy.get('.virtual-try-on-diy-wrapper')
          .get('.vton-diy')
          .get('.step')
          .should('have.length', 3)
      })
    })
  })
  describe('Function', () => {
    describe('VTON DIY', () => {
      it('should generate one vton record', () => {
        let fileName = 'vton_pose.png'
        cy.fixture(fileName).then(fileContent => {
          cy.get('.pose_panel_select')
            .eq(0)
            .within(() => {
              cy.get('#selected_file_pose_image')
                .upload({
                  fileContent,
                  fileName,
                  mimeType: 'image/png'
                })
            })
        })
        cy.wait(1000)
        cy.screenshot('frontend-vton-diy-step-1')
        cy.get('.next')
          .eq(0)
          .click()
        cy.wait(1000)

        fileName = 'vton_cloth.png'
        cy.fixture(fileName).then(fileContent => {
          cy.get('.cloth_panel_select')
            .eq(0)
            .within(() => {
              cy.get('#selected_file_cloth_image')
                .upload({
                  fileContent,
                  fileName,
                  mimeType: 'image/png'
                })
            })
        })
        cy.wait(1000)
        cy.screenshot('frontend-vton-diy-step-2')
        cy.get('.next')
          .eq(1)
          .click()
        cy.wait(15000)
        cy.screenshot('frontend-vton-diy-step-3')
      })
    })
  })
})
