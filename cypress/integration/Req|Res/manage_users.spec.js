/// <reference types = "Cypress"/>

var user

before(() => {
    cy.fixture('./../../fixtures/Req|Res/user_req.json').then(userData => {
        user = userData
    })
})

describe('Manage the Users', () => {
    it('Create New User', () => {
        cy.request({ method: 'POST', url: '/api/users', body: user}).then(response => {
            expect(response.status).to.be.eq(201)
            expect(response.body).to.be.not.null
            expect(response.body.first_name).to.be.eq(user.first_name)
            expect(response.body.last_name).to.be.eq(user.last_name)
            expect(response.body.email).to.be.eq(user.email)
            expect(response.body.job).to.be.eq(user.job)
            cy.log(response.body.id)
            cy.log(response.body.createdAt)
        })
    })

    it('Delete the User', () => {
        cy.request({ method: 'DELETE', url: '/api/users'}).then(response => {
            expect(response.status).to.be.eq(204)
            expect(response.body).to.be.empty
        })
    })
})