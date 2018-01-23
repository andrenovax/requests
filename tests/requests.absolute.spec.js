let api = require('../src/settings');
let requests = require('../src/requests');
// let { successResponse } = require('./helpers');


describe('Absolute requests', () => {
  beforeEach(() => {
    jest.resetModules();
    api = require('../src/settings');
    requests = require('../src/requests');
    api.setConfig('cometomemydear');
  });

  test('throws error when no url provided', () => {
    expect(() => { requests.abs(); }).toThrow(new TypeError('url should be a string. Not a undefined'));
  });

  test('throws error when url not a string', () => {
    expect(() => { requests.abs(123); }).toThrow(new TypeError('url should be a string. Not a number'));
  });

  test('throws error when config is not an object', () => {
    expect(() => { requests.abs(123); }).toThrow(new TypeError('url should be a string. Not a number'));
  });

  // TODO: WTF?!

  // test('makes get request when no config', () => {
  //   global.fetch = jest.fn().mockImplementation(successResponse)
  //   api.request('123')
  //   expect(global.fetch.mock.calls[0][0]).toBe('123')
  // })

  // test('goes to provided url with provided config when no request middleware is set', () => {
  //   global.fetch = jest.fn().mockImplementation(successResponse)

  //   expect(api.request('123', { method: 'PUT', })).resolves.toBe('123')
  //   expect(global.fetch.mock.calls[0][0]).toBe('123')
  //   expect(global.fetch.mock.calls[0][1].method).toBe('PUT')
  // })
});
