/// <reference types="Cypress"/>

const authorization = Cypress.config('auth_token')
var user_id, user_create, post_id, post_create

before(() => {
    Cypress.config('baseUrl', 'https://gorest.co.in')

    cy.fixture('/goRest/user_create.json').then(userData => {
        user_create = userData
    })

    cy.fixture('/goRest/post_create.json').then(userData => {
        post_create = userData
    })
})

after(() => {
    cy.delete_user(authorization, user_id).then(response => {
        expect(response.status).to.be.eq(204)
    })
})

describe('Managing the Posts', () => {
    it('Create New Post - Success', () => {
        cy.create_user(authorization, user_create).then(response => {
            expect(response.status).to.be.eq(201)
            user_id = response.body.data.id

            cy.request({
                method: 'POST',
                url: '/public/v1/users/' + user_id + '/posts',
                headers: { authorization },
                body: post_create,
                failOnStatusCode: false
            }).then(response => {
                expect(response.status).to.be.eq(201)
                expect(response.body).to.be.not.null
                post_id = response.body.data.id
                expect(response.body.data.title).to.be.eq(post_create.title)
                expect(response.body.data.body).to.be.eq(post_create.body)
                cy.log(post_id)
            })
        })
    })

    it('Delete the Post - Success', () => {
        cy.request({
            method: 'DELETE',
            url: '/public/v1/posts/' + post_id + '',
            headers: { authorization },
            failOnStatusCode: false
        }).then(response => {
            expect(response.status).to.be.eq(204)
            expect(response.body).to.be.empty
        })
    })
})