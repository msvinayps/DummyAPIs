// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('create_user', (authorization, user_create) => {
    var response
    cy.request({
        method: 'POST',
        url: '/public/v1/users',
        body: user_create,
        headers: { authorization },
        failOnStatusCode: false
    }).then(responseBody => {
        expect(responseBody.status).to.be.eq(201)
        expect(responseBody.body).to.not.be.null
        cy.log('User Account Created')
        response = responseBody
    })
    return response
})

Cypress.Commands.add('update_user', (authorization, user_update, user_id) => {
    var response
    cy.request({
        method: 'PUT',
        url: '/public/v1/users/' + user_id + '',
        body: user_update,
        headers: { authorization },
        failOnStatusCode: false
    }).then(responseData => {
        response = responseData
    })
    return response
})

Cypress.Commands.add('delete_user', (authorization, user_id) => {
    var response
    cy.request({
        method: 'DELETE',
        url: '/public/v1/users/' + user_id + '',
        headers: { authorization },
        failOnStatusCode: false
    }).then(responseData => {
        response = responseData
    })
    return response
})
