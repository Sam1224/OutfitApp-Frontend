/**
 * @Author: Sam
 * @Date: 2020/4/18
 * @Version: 1.0
 **/
/* eslint-disable */
const config = require('../../config/config')
let url = '/login'
let apiBaseUrl = config.apiBaseUrl

describe ('Test footer of the frontend ui', () => {
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
  })
  describe('Content', () => {
    describe('Footer', () => {
      it('shows 4 router links and 1 + icon (with 3 router links inside)', () => {
        cy.get('.footer')
          .get('.footer-item')
          .should('have.length', 5)
        cy.get('.footer')
          .within(() => {
            cy.get('.footer-item')
              .eq(0)
              .within(() => {
                cy.get('.el-icon-s-home')
              })
            cy.get('.footer-item')
              .eq(1)
              .within(() => {
                cy.get('.el-icon-s-goods')
              })
            cy.get('.footer-item')
              .eq(2)
              .within(() => {
                cy.get('.el-icon-circle-plus')
                  .click()
              })
            cy.get('.footer-item')
              .eq(3)
              .within(() => {
                cy.get('.el-icon-s-help')
              })
            cy.get('.footer-item')
              .eq(4)
              .within(() => {
                cy.get('.el-icon-s-custom')
              })
          })

        cy.wait(1000)
        cy.get('.add-item')
          .should('have.length', 3)
        cy.get('.add-item')
          .eq(0)
          .within(() => {
            cy.get('.el-icon-s-goods')
          })
        cy.get('.add-item')
          .eq(1)
          .within(() => {
            cy.get('.el-icon-s-goods')
          })
        cy.get('.add-item')
          .eq(2)
          .within(() => {
            cy.get('.el-icon-s-help')
          })
      })
    })
  })
  describe('Redirection', () => {
    describe('Already logined', () => {
      beforeEach(() => {
        let loginForm = cy.get('.login-form')
        loginForm.get('.username')
          .type('user1')
        loginForm.get('.password')
          .type('123456')
        loginForm.get('.submit')
          .click()
        cy.wait(3000)
      })
      it('should redirect to the home page when the first icon is clicked', () => {
        cy.get('.footer')
          .within(() => {
            cy.get('.footer-item')
              .eq(0)
              .within(() => {
                cy.get('.el-icon-s-home')
                  .click()
                cy.wait(3000)
                cy.url().should('contain', '/home')
              })
          })
      })
      it('should redirect to the vton list page when the second icon is clicked', () => {
        cy.get('.footer')
          .within(() => {
            cy.get('.footer-item')
              .eq(1)
              .within(() => {
                cy.get('.el-icon-s-goods')
                  .click()
                cy.wait(3000)
                cy.url().should('contain', '/vton-list')
              })
          })
      })
      it('should redirect to the retrieval list page when the forth icon is clicked', () => {
        cy.get('.footer')
          .within(() => {
            cy.get('.footer-item')
              .eq(3)
              .within(() => {
                cy.get('.el-icon-s-help')
                  .click()
                cy.wait(3000)
                cy.url().should('contain', '/retrieval-list')
              })
          })
      })
      it('should redirect to the personal page when the fifth icon is clicked', () => {
        cy.get('.footer')
          .within(() => {
            cy.get('.footer-item')
              .eq(4)
              .within(() => {
                cy.get('.el-icon-s-custom')
                  .click()
                cy.wait(3000)
                cy.url().should('contain', '/personal')
              })
          })
      })
      it('should redirect to the vton page when the first icon in + panel is clicked', () => {
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
          .eq(0)
          .within(() => {
            cy.get('.el-icon-s-goods')
              .click()
            cy.wait(3000)
            cy.url().should('contain', '/vton')
          })
      })
      it('should redirect to the vton diy page when the second icon in + panel is clicked', () => {
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
            cy.wait(3000)
            cy.url().should('contain', '/vton-diy')
          })
      })
      it('should redirect to the vton page when the third icon in + panel is clicked', () => {
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
          .eq(2)
          .within(() => {
            cy.get('.el-icon-s-help')
              .click()
            cy.wait(3000)
            cy.url().should('contain', '/retrieval')
          })
      })
    })
    describe('Not logined', () => {
      it('should redirect to the home page when the first icon is clicked', () => {
        cy.get('.footer')
          .within(() => {
            cy.get('.footer-item')
              .eq(0)
              .within(() => {
                cy.get('.el-icon-s-home')
                  .click()
                cy.wait(3000)
                cy.url().should('contain', '/home')
              })
          })
      })
      it('should redirect to the login page when the second icon is clicked', () => {
        cy.get('.footer')
          .within(() => {
            cy.get('.footer-item')
              .eq(1)
              .within(() => {
                cy.get('.el-icon-s-goods')
                  .click()
                cy.wait(3000)
                cy.url().should('contain', '/login')
              })
          })
      })
      it('should redirect to the login page when the forth icon is clicked', () => {
        cy.get('.footer')
          .within(() => {
            cy.get('.footer-item')
              .eq(3)
              .within(() => {
                cy.get('.el-icon-s-help')
                  .click()
                cy.wait(3000)
                cy.url().should('contain', '/login')
              })
          })
      })
      it('should redirect to the login page when the fifth icon is clicked', () => {
        cy.get('.footer')
          .within(() => {
            cy.get('.footer-item')
              .eq(4)
              .within(() => {
                cy.get('.el-icon-s-custom')
                  .click()
                cy.wait(3000)
                cy.url().should('contain', '/login')
              })
          })
      })
      it('should redirect to the login page when the first icon in + panel is clicked', () => {
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
          .eq(0)
          .within(() => {
            cy.get('.el-icon-s-goods')
              .click()
            cy.wait(3000)
            cy.url().should('contain', '/login')
          })
      })
      it('should redirect to the login page when the second icon in + panel is clicked', () => {
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
            cy.wait(3000)
            cy.url().should('contain', '/login')
          })
      })
      it('should redirect to the login page when the third icon in + panel is clicked', () => {
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
          .eq(2)
          .within(() => {
            cy.get('.el-icon-s-help')
              .click()
            cy.wait(3000)
            cy.url().should('contain', '/login')
          })
      })
    })
  })
})
