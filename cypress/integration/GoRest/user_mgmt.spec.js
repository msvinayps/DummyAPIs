/// <reference types="Cypress"/>

var user_id, user_create, user_update
const authorization = Cypress.config('auth_token')

before(() => {
    Cypress.config('baseUrl', 'https://gorest.co.in')

    cy.fixture('/goRest/user_create.json').then(userData => {
        user_create = userData
    })

    cy.fixture('/goRest/user_update.json').then(userData => {
        user_update = userData
    })
})

afterEach(() => {
    cy.delete_user(authorization, user_id)
        .then(response => {
            if (response.status == 204) {
                cy.log('User Account Deleted')
            }
        })
})

describe('Creating User', () => {
    it('Successful User Creation', () => {
        cy.create_user(authorization, user_create)
            .then(response => {
                user_id = response.body.data.id

                expect(response.body.data.name).to.be.eq(user_create.name)
                expect(response.body.data.email).to.be.eq(user_create.email)
                expect(response.body.data.gender).to.be.eq(user_create.gender)
                expect(response.body.data.status).to.be.eq(user_create.status)
            })
    })

    it('Duplicate User Create Fail', () => {
        cy.create_user(authorization, user_create)
            .then(response => {
                user_id = response.body.data.id

                cy.request({
                    method: 'POST',
                    url: '/public/v1/users',
                    body: user_create,
                    headers: { authorization },
                    failOnStatusCode: false
                }).then(response => {
                        expect(response.status).to.be.eq(422)
                        expect(response.body).to.not.be.null
                        expect(response.body.data[0].field).to.be.eq('email')
                        expect(response.body.data[0].message).to.be.eq('has already been taken')
                    })
            })
    })

    it('Create User Authentication Fail', () => {
        cy.request({
            method: 'POST',
            url: '/public/v1/users',
            body: user_create,
            failOnStatusCode: false
        }).then(response => {
            expect(response.status).to.be.eq(401)
            expect(response.body).to.not.be.null
            expect(response.body.data.message).to.be.eq('Authentication failed')
        })
    })

    it('Successful User Updation', () => {
        cy.create_user(authorization, user_create)
            .then(response => {
                user_id = response.body.data.id

                cy.update_user(authorization, user_update[0], user_id)
                    .then(response => {
                        expect(response.status).to.be.eq(200)
                        expect(response).to.be.not.null
                        expect(response.body.data.id).to.be.eq(user_id)
                        expect(response.body.data.name).to.be.eq(user_update[0].name)
                        expect(response.body.data.email).to.be.eq(user_update[0].email)
                        expect(response.body.data.gender).to.be.eq(user_update[0].gender)
                        expect(response.body.data.status).to.be.eq(user_update[0].status)

                        cy.log('User Account Updated')
                    })
            })
    })

    it('Duplicate Email Update Fail', () => {
        cy.create_user(authorization, user_create)
            .then(response => {
                user_id = response.body.data.id

                cy.update_user(authorization, user_update[1], user_id)
                    .then(response => {
                        expect(response.status).to.be.eq(422)
                        expect(response).to.be.not.null
                        expect(response.body.data[0].field).to.be.eq('email')
                        expect(response.body.data[0].message).to.be.eq('has already been taken')

                    })
            })
    })

    // it('Verify User in List', () => {
    //     cy.request({
    //         method: 'GET',
    //         url: '/public/v1/users?id=' + user_id + '',
    //     }).then(response => {
    //         expect(response.status).to.be.eq(200)
    //         expect(response).to.be.not.null
    //         expect(response.body.data[0].id).to.be.eq(user_id)
    //         expect(response.body.data[0].name).to.be.eq(user_update[0].name)
    //         expect(response.body.data[0].email).to.be.eq(user_update[0].email)
    //         expect(response.body.data[0].gender).to.be.eq(user_update[0].gender)
    //         expect(response.body.data[0].status).to.be.eq(user_update[0].status)

    //         expect(response.body.meta.pagination.total).to.be.eq(1)
    //     })
    // })

    it('Successful User Deletion', () => {
        cy.create_user(authorization, user_create)
            .then(response => {
                user_id = response.body.data.id

                cy.delete_user(authorization, user_id)
                    .then(response => {
                        expect(response.status).to.be.eq(204)
                        expect(response.body).to.be.empty
                        cy.log('User Account Deleted')
                    })
            })
    })

    it('Delete Non-Existing User', () => {
        cy.create_user(authorization, user_create)
            .then(response => {
                user_id = response.body.data.id

                cy.delete_user(authorization, user_id)
                    .then(response => {
                        expect(response.status).to.be.eq(204)
                        expect(response.body).to.be.empty
                        cy.log('User Account Deleted')
                    })

                cy.delete_user(authorization, user_id)
                    .then(response => {
                        expect(response.status).to.be.eq(404)
                        expect(response.body).to.be.not.null
                        expect(response.body.data.message).to.be.eq('Resource not found')
                        cy.log('User Account Doesn"t Exist')
                    })
            })
    })

    it('Verify User Search', () => {
        var users
        cy.request({
            method: 'GET',
            url: '/public/v1/users'
        }).then(response => {
            users = response.body.data
        }).then(data => {
            for (let index = 0; index < users.length; index++) {
                cy.log('Index: ' + index)
                cy.request({
                    method: 'GET',
                    url: '/public/v1/users?email=' + users[index].email + ''
                }).then(response => {
                    expect(response.status).to.be.eq(200)
                    expect(response).to.be.not.null
                    expect(response.body.data[0].id).to.be.eq(users[index].id)
                    expect(response.body.data[0].name).to.be.eq(users[index].name)
                    expect(response.body.data[0].email).to.be.eq(users[index].email)
                    expect(response.body.data[0].gender).to.be.eq(users[index].gender)
                    expect(response.body.data[0].status).to.be.eq(users[index].status)

                    assert.equal(response.body.meta.pagination.total, 1)
                })
            }
        })
    })
})