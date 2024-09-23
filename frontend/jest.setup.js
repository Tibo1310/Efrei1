global.fetch = require('jest-fetch-mock');
global.alert = jest.fn();

fetch.mockResponse(JSON.stringify({ token: 'fake-token', username: 'testuser', userId: '12345', icon: 'fas fa-user-circle' }));