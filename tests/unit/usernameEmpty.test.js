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

    // สร้าง DOM จำลอง
    document.body.innerHTML = `
      <input id="username" />
      <input id="password" />
      <button id="submit">Login</button>
    `;

    window.alert = jest.fn();
    global.fetch = jest.fn();

    // โหลดสคริปต์หลัก
    require('../../index.js');

    // จำลอง DOMContentLoaded
    const event = new window.Event('DOMContentLoaded');
    document.dispatchEvent(event);
  });

  afterEach(() => jest.resetAllMocks());

  it('username empty', async () => {
    // mock API ตอบกลับ user ที่ถูกต้อง
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ username: 'admin', password: '1234' }],
    });

    // ป้อนค่าจำลอง: username ว่าง
    document.getElementById('username').value = '';
    document.getElementById('password').value = '1234';

    // จำลองคลิกปุ่ม Login
    const clickEvent = new window.Event('click');
    document.getElementById('submit').dispatchEvent(clickEvent);

    // รอ event loop ทำงาน
    await new Promise(process.nextTick);

    // ตรวจสอบว่ามี alert ที่คาดไว้
    expect(window.alert).toHaveBeenCalledWith('username or password is incorrect');
  });
});