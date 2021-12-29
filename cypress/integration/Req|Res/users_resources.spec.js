/// <reference types="Cypress"/>
const baseUrl = Cypress.config("baseUrl")
var usersData, user

before(() => {
    cy.fixture('./../../fixtures/Req|Res/users_list_req.json').then(users => {
        usersData = users
    })
    cy.fixture('./../../fixtures/Req|Res/user_req.json').then(userData => {
        user = userData
    })
})

describe('Manage Users and Resources', () => {
    it('Verify Users List', () => {
        let per_page = 12
        cy.request('GET', '/api/users?page=1&per_page=' + per_page + '').as('response')

        cy.get('@response').then(response => {
            expect(response.status).to.eq(200)
            expect(response.body).to.not.be.null
            expect(response.body).to.have.property('page', 1)
            expect(response.body.data).to.have.length(per_page)
            expect(response.body.data).to.deep.eq(usersData)
            expect(response.body.support.url).to.eq('https://reqres.in/#support-heading')
            expect(response.body.support.text).to.eq('To keep ReqRes free, contributions towards server costs are appreciated!')
            let emails = [12]
            cy.wrap(response.body.data).each((array, index, list) => {
                emails[index] = array.email
            }).then(data => {
                expect(emails).contains(user.email)
            })
            cy.log(emails)
        })
    })

    it('Verify Individual Detail - Success', () => {
        cy.request('GET', '/api/users/2').then(response => {
            expect(response).to.not.be.null
            expect(response.status).to.eq(200)
            expect(response.body.data.email).to.be.eq(user.email)
            expect(response.body.data.first_name).to.be.eq(user.first_name)
            expect(response.body.data.last_name).to.be.eq(user.last_name)
        })
    })

    it('Verify Individual Detail - Fail', () => {
        cy.request({ method: 'GET', url: '/api/users/2456', failOnStatusCode: false }).then(response => {
            expect(response.status).to.eq(404)
            expect(response.body).to.be.empty
        })
    })
})