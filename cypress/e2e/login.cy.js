/* global describe, beforeEach, it, cy, Cypress */
describe('Login Flow', () => {
  beforeEach(() => {
    // Intercept login and user profile APIs to make tests deterministic
    cy.intercept('POST', 'https://forum-api.dicoding.dev/v1/login', {
      status: 'success',
      message: 'ok',
      data: {
        token: 'mock-access-token-123456'
      }
    }).as('loginRequest');

    cy.intercept('GET', 'https://forum-api.dicoding.dev/v1/users/me', {
      status: 'success',
      message: 'ok',
      data: {
        user: {
          id: 'user-1',
          name: 'Jane Doe',
          email: 'jane@example.com',
          avatar: 'https://ui-avatars.com/api/?name=Jane+Doe'
        }
      }
    }).as('profileRequest');

    cy.intercept('GET', 'https://forum-api.dicoding.dev/v1/threads', {
      status: 'success',
      message: 'ok',
      data: {
        threads: [
          {
            id: 'thread-1',
            title: 'Mock Thread Title',
            body: 'This is a mock thread body.',
            category: 'general',
            createdAt: '2026-07-18T10:00:00.000Z',
            ownerId: 'user-1',
            upVotesBy: [],
            downVotesBy: [],
            totalComments: 0
          }
        ]
      }
    }).as('threadsRequest');

    cy.intercept('GET', 'https://forum-api.dicoding.dev/v1/users', {
      status: 'success',
      message: 'ok',
      data: {
        users: [
          {
            id: 'user-1',
            name: 'Jane Doe',
            email: 'jane@example.com',
            avatar: 'https://ui-avatars.com/api/?name=Jane+Doe'
          }
        ]
      }
    }).as('usersRequest');

    cy.intercept('GET', 'https://forum-api.dicoding.dev/v1/leaderboards', {
      status: 'success',
      message: 'ok',
      data: {
        leaderboards: [
          {
            user: {
              id: 'user-1',
              name: 'Jane Doe',
              avatar: 'https://ui-avatars.com/api/?name=Jane+Doe'
            },
            score: 100
          }
        ]
      }
    }).as('leaderboardsRequest');

    cy.visit('/login');
  });

  it('should display the login page correctly', () => {
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should display an error when the API returns an error on invalid credentials', () => {
    // Intercept login specifically for this test to fail
    cy.intercept('POST', 'https://forum-api.dicoding.dev/v1/login', {
      statusCode: 400,
      body: {
        status: 'fail',
        message: 'Email or password is wrong'
      }
    }).as('failedLoginRequest');

    cy.get('input[type="email"]').type('wrong@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@failedLoginRequest');
    cy.contains('Email or password is wrong').should('be.visible');
  });

  it('should successfully log in and redirect to home page', () => {
    cy.get('input[type="email"]').type('jane@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.wait('@profileRequest');

    // Should redirect to home page
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);

    // Should show logged in user's name
    cy.contains('Jane Doe').should('be.visible');
  });
});
