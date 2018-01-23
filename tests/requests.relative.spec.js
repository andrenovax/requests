let api = require('../src/settings');
let requests = require('../src/requests');
const { successResponse } = require('./helpers');


describe('Relative requests', () => {
  beforeAll(() => {
    global.fetch = jest.fn().mockImplementation(successResponse);
  });

  beforeEach(() => {
    jest.resetModules();
    api = require('../src/settings');
    requests = require('../src/requests');
    api.setConfig('cometomemydear');
  });

  describe('post', () => {
    test('makes POST request to configured plus passed url and stringified body', () => {
      requests.post('/post', { a: '1' });

      expect(global.fetch).toHaveBeenLastCalledWith('cometomemydear/post', { body: JSON.stringify({ a: '1' }), method: 'POST' });
    });

    test('throws an error when url is not a string', () => {
      expect(() => requests.post(123, { a: '1' })).toThrow(new TypeError('url should be a string. Not a number'));
    });

    test('throws an error when body is not provided', () => {
      expect(() => requests.post('/post')).toThrow('body is required to make a POST request');
    });
  });

  describe('put', () => {
    test('makes PUT request to configured plus passed url and stringified body', () => {
      requests.put('/put', { a: '1' });

      expect(global.fetch).toHaveBeenLastCalledWith('cometomemydear/put', { body: JSON.stringify({ a: '1' }), method: 'PUT' });
    });

    test('throws an error when url is not a string', () => {
      expect(() => requests.put(123, { a: '1' })).toThrow(new TypeError('url should be a string. Not a number'));
    });

    test('throws an error when body is not provided', () => {
      expect(() => requests.put('/put')).toThrow('body is required to make a PUT request');
    });
  });

  describe('delete', () => {
    test('makes DELETE request to configured plus passed url and stringified body on del', () => {
      requests.del('/delete', { a: '1' });

      expect(global.fetch).toHaveBeenLastCalledWith('cometomemydear/delete', { body: JSON.stringify({ a: '1' }), method: 'DELETE' });
    });

    test('throws an error when url is not a string', () => {
      expect(() => requests.del(123, { a: '1' })).toThrow(new TypeError('url should be a string. Not a number'));
    });

    test('throws an error when body is not provided', () => {
      expect(() => requests.del('/delete')).toThrow('body is required to make a DELETE request');
    });
  });

  describe('get', () => {
    test('makes GET request to provided url when url is a string', () => {
      requests.get('/wakemeup');

      expect(global.fetch).toHaveBeenLastCalledWith('cometomemydear/wakemeup', { body: undefined, method: 'GET' });
    });

    test('throws an error when url is not a string', () => {
      expect(() => requests.get(123)).toThrow(new TypeError('url should be a string. Not a number'));
    });

    test('throws an error when params are not an object or string', () => {
      expect(() => requests.get('/wakemeup', 123)).toThrow(new TypeError('url params should be a string or object. Not a number'));
    });

    test('adds params to url when params are provided as a string', () => {
      requests.get('/wakemeup', '123');

      expect(global.fetch).toHaveBeenLastCalledWith('cometomemydear/wakemeup?123', { body: undefined, method: 'GET' });
    });

    test('adds params to url when params are provided as an object', () => {
      requests.get('/wakemeup', { a: '123', b: 456 });

      expect(global.fetch).toHaveBeenLastCalledWith('cometomemydear/wakemeup?a=123&b=456', { body: undefined, method: 'GET' });
    });
  });
});
