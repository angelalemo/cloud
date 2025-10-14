/**
 * @jest-environment jsdom
 */

const { TextEncoder, TextDecoder } = require('util'); // polyfill for jsdom env
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

describe('Login page script - login success', () => {
  let window, document;

  beforeEach(() => {
    // เคลียร์ module cache เพื่อให้ require('../../index.js') โหลดใหม่ทุกเทสต์
    jest.resetModules();

    window = global.window;
    document = global.document;

    // สร้าง DOM แบบเดียวกับ passwordincorrect.test.js
    document.body.innerHTML = `
      <input id="username" />
      <input id="password" />
      <button id="submit">Login</button>
    `;

    // mocks
    window.alert = jest.fn();
    global.fetch = jest.fn();

    // โหลดสคริปต์ (require หลังสร้าง DOM เพื่อให้ event listeners attach)
    require('../../index.js');

    // ถ้า index.js ฟัง DOMContentLoaded ให้ trigger (ในกรณีสคริปต์ผูก listener บน DOMContentLoaded)
    const domContentLoadedEvent = new window.Event('DOMContentLoaded');
    document.dispatchEvent(domContentLoadedEvent);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('alerts "login completed" when username and password are correct', async () => {
    // เตรียม mock fetch ให้คืน users ที่รวม admin/1234
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ username: 'admin', password: '1234' }],
    });

    // กรอกฟิลด์ใน DOM
    document.getElementById('username').value = 'admin';
    document.getElementById('password').value = '1234';

    // trigger click บนปุ่ม submit (ให้ตรงกับที่ index.js ฟังเหตุการณ์)
    const clickEvent = new window.Event('click');
    document.getElementById('submit').dispatchEvent(clickEvent);

    // รอ microtasks queue ให้ fetch/Promise ถูก resolve
    await new Promise(process.nextTick);

    // ตรวจว่า alert('login completed') ถูกเรียก
    expect(window.alert).toHaveBeenCalledWith('login completed');

    // และตรวจว่า alert ถูกเรียกเพียงครั้งเดียว (optional)
    expect(window.alert).toHaveBeenCalledTimes(1);
  });
});
