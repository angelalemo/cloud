/**
 * @jest-environment jsdom
 */

const { TextEncoder, TextDecoder } = require('util'); // polyfill
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

global.fetch = jest.fn();

describe('Login page script', () => {
  let document, window;

  beforeEach(() => {
    window = global.window;
    document = global.document;

    // สร้าง DOM สำหรับแต่ละ test
    document.body.innerHTML = `
    <input id="username" />
    <input id="password" />
    <button id="submit">Login</button>
  `;

    window.alert = jest.fn();
    global.fetch = jest.fn();

    // โหลด index.js หลังสร้าง DOM
    require('../../index.js');

    // จำลอง DOMContentLoaded ให้ listener attach
    const domContentLoadedEvent = new window.Event('DOMContentLoaded');
    document.dispatchEvent(domContentLoadedEvent);
  });

  afterEach(() => jest.resetAllMocks());


  it('Username is incorrect', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ username: 'admin', password: '1234' }],
    });

    document.getElementById('username').value = 'UnknowUser';
    document.getElementById('password').value = 'wrongpassword';

    const clickEvent = new window.Event('click');
    document.getElementById('submit').dispatchEvent(clickEvent);

    await new Promise(process.nextTick);

    expect(window.alert).toHaveBeenCalledWith('username or password is incorrect');
  });

});
