let api = require('../src/settings');

describe('configuration', () => {
  beforeEach(() => {
    jest.resetModules();
    api = require('../src/settings');
  });

  test('throws error when apiUrl is not provided', () => {
    expect(() => { api.setConfig(); }).toThrow(new TypeError('apiUrl should be a string. Not a undefined'));
  });

  test('throws error when apiUrl is not a string', () => {
    expect(() => { api.setConfig(123); }).toThrow(new TypeError('apiUrl should be a string. Not a number'));
  });

  test('sets api url when string provided', () => {
    const conf = api.setConfig('cometomemydear');
    expect(conf.apiUrl).toBe('cometomemydear');
  });

  test('throws error when shouldCancelPreviousRequest is not a boolean', () => {
    expect(() => { api.setConfig('cometomemydear', 'ima string'); }).toThrow(new TypeError('shouldCancelPreviousRequest should be a boolean. Not a string'));
  });

  test('sets shouldCancelPreviousRequest as false when nothing provided', () => {
    const conf = api.setConfig('cometomemydear');
    expect(conf.shouldCancelPreviousRequest).toBe(false);
  });

  test('sets shouldCancelPreviousRequest to true when boolean provided', () => {
    const conf = api.setConfig('cometomemydear', true);
    expect(conf.shouldCancelPreviousRequest).toBe(true);
  });
});

describe('setting middleware', () => {
  beforeEach(() => {
    jest.resetModules();
    api = require('../src/index');
  });

  test('throws error when no middleware provided', () => {
    expect(() => { api.setMiddleware({}); }).toThrow(new TypeError('requests should be a array. Not a undefined'));
  });

  test('throws error when requests provided is not an array', () => {
    expect(() => { api.setMiddleware({ requests: 123, responses: [] }); }).toThrow(new TypeError('requests should be a array. Not a number'));
  });

  test('throws error when responses provided is not an array', () => {
    expect(() => { api.setMiddleware({ requests: [], responses: 123 }); }).toThrow(new TypeError('responses should be a array. Not a number'));
  });

  test('throws error when empty responses and requests provided', () => {
    expect(() => { api.setMiddleware({ requests: [], responses: [] }); }).toThrow('no request nor response middleware provided');
  });

  test('throws error when request middleware provided is not a function', () => {
    expect(() => { api.setMiddleware({ requests: [123], responses: [] }); }).toThrow(new TypeError('request middleware should be a function. Not a number'));
  });

  test('throws error when response middleware provided is not a function', () => {
    expect(() => { api.setMiddleware({ requests: [], responses: [123] }); }).toThrow(new TypeError('response middleware should be a function. Not a number'));
  });

  test('works fine if only request middleware provided', () => {
    const func = () => {};
    const middleware = api.setMiddleware({ requests: [func], responses: [] });
    expect(middleware.request.length).toBe(1);
    expect(middleware.request[0]).toBe(func);
    expect(middleware.response.length).toBe(1); // 1 - default
  });

  test('works fine if only response middleware provided', () => {
    const func = () => {};
    const middleware = api.setMiddleware({ requests: [], responses: [func] });
    expect(middleware.response.length).toBe(2); // 1 - default + 1
    expect(middleware.response[1]).toBe(func);
    expect(middleware.request.length).toBe(0);
  });

  test('works fine when both response and request middleware provided', () => {
    const func = () => {};
    const middleware = api.setMiddleware({ requests: [func], responses: [func] });
    expect(middleware.response.length).toBe(2); // 1 - default + 1
    expect(middleware.request.length).toBe(1);
  });
});
