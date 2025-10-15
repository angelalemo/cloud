/**
 * @jest-environment jsdom
 */
const { TextEncoder, TextDecoder } = require('util'); // polyfill for jsdom env
const { set } = require('../../app.js');
const { resolve } = require('path');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

describe('Login page script - delete user', () => {
  let window, document;
    beforeEach(() => {
    
    jest.resetModules();
    window = global.window;
    document = global.document;
    
    document.body.innerHTML = `
        <input id="id" />
        <button id="submit">Delete</button>
    `;    
    
    window.alert = jest.fn();
    global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ success: true }),
        })
    );
    
    require('../../deleteusers.js');
    
    const domContentLoadedEvent = new window.Event('DOMContentLoaded');
    document.dispatchEvent(domContentLoadedEvent);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });    

    it('alerts "User deleted successfully" when user is deleted', async () => {
      fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
      });
        const idInput = document.getElementById('id');
        idInput.value = 1;
        const submitButton = document.getElementById('submit');
        submitButton.click();
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(window.alert).toHaveBeenCalledWith('User deleted successfully');
    });

    it('alerts "Failed to delete user" when deletion fails', async () => {
      fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false, message: 'User not found' }),
      });
        const idInput = document.getElementById('id');
        idInput.value = 999;
        const submitButton = document.getElementById('submit');
        submitButton.click();
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(window.alert).toHaveBeenCalledWith('Failed to delete user: User not found');
    });
});
