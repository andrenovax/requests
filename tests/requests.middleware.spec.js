let api = require('../src/settings');
let requests = require('../src/requests');
const { successResponse } = require('./helpers');


const requestMiddlewareOne = (url, config) => [
  `${url} works`,
  { ...config, mw: 'yes' },
];

const requestMiddlewareTwo = (url, config) => [
  `${url} 2`,
  { ...config, method: 'POST' },
];

describe('Request with request middleware', () => {
  beforeEach(() => {
    jest.resetModules();
    api = require('../src/settings');
    requests = require('../src/requests');
    api.setConfig('cometomemydear');
  });

  test('uses url and config from request middleware provided (1 middleware case)', () => {
    api.setMiddleware({ requests: [requestMiddlewareOne], responses: [] });

    global.fetch = jest.fn().mockImplementation(successResponse);

    expect(requests.abs('123', { method: 'PUT' })).resolves.toBe('works');
    expect(global.fetch).toBeCalledWith('123 works', { method: 'PUT', mw: 'yes' });
  });

  test('uses url and config from request middleware provided (2 middleware case)', () => {
    api.setMiddleware({ requests: [requestMiddlewareOne, requestMiddlewareTwo], responses: [] });

    global.fetch = jest.fn().mockImplementation(successResponse);

    expect(requests.abs('123', { method: 'PUT' })).resolves.toBe('works');
    expect(global.fetch).toBeCalledWith('123 works 2', { method: 'POST', mw: 'yes' });
  });
});

describe('Request with response middleware', () => {
  beforeEach(() => {
    jest.resetModules();
    api = require('../src/settings');
    requests = require('../src/requests');
    api.setConfig('cometomemydear');
  });

  test('custom response middleware receives promise as an argument', () => {
    const responseMiddlewareFirst = jest.fn();

    api.setMiddleware({ requests: [], responses: [responseMiddlewareFirst] });

    global.fetch = jest.fn().mockImplementation(successResponse);

    requests.abs('123', { method: 'PUT' });
    expect(responseMiddlewareFirst.mock.calls[0][0]).resolves.toBe('works');
  });

  test('returns promise parsed by response middleware on success', () => {
    const jsonResponse = () => (
      new Promise((resolve) => { resolve({ json: () => ({ iam: 'json' }) }); })
    );

    global.fetch = jest.fn().mockImplementation(jsonResponse);

    expect(requests.abs('123', { method: 'PUT' })).resolves.toMatchObject({ iam: 'json' });
  });

  test('returns promise parsed by response middleware on error', () => {
    const errorResponse = () => (
      new Promise((resolve, reject) => { reject(new Error({ code: 500 })); })
    );

    global.fetch = jest.fn().mockImplementation(errorResponse);

    expect(requests.abs('123', { method: 'PUT' })).resolves.toMatchObject({ error: 'Server Error' });
  });
});

