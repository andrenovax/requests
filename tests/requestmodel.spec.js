let api = require('../src/settings');
let { RequestModel } = require('../src/requestmodel');
const { successResponse } = require('./helpers');


describe('RequestModel', () => {
  beforeAll(() => {
    global.fetch = jest.fn().mockImplementation(successResponse);
  });

  beforeEach(() => {
    jest.resetModules();
    api = require('../src/settings');
    RequestModel = require('../src/requestmodel').RequestModel;
    api.setConfig('cometomemydear');
  });

  test('throws error when rootUrl is not a string on init', () => {
    expect(() => new RequestModel(123)).toThrow(new TypeError('url should be a string. Not a number'));
  });

  test('sets rootUrl to value provided on initialization', () => {
    const testApi = new RequestModel('/test');
    expect(testApi.rootUrl).toBe('/test');
  });

  test('requests valid url when no params are specified on all', () => {
    const testApi = new RequestModel('/test');
    testApi.all();
    expect(global.fetch).toHaveBeenLastCalledWith('cometomemydear/test', { body: undefined, method: 'GET' });
  });

  test('requests valid url when params are specified on all', () => {
    const testApi = new RequestModel('/test');
    testApi.all({ some: 'value', to: 'test' });
    expect(global.fetch).toHaveBeenLastCalledWith('cometomemydear/test?some=value&to=test', { body: undefined, method: 'GET' });
  });

  test('throws an error when modelItem does not have id on get', () => {
    const testApi = new RequestModel('/test');
    expect(() => testApi.get(123)).toThrow('modelItem does not have id');
  });

  test('requests valid url with valid modelItem on get', () => {
    const testApi = new RequestModel('/test');
    testApi.get({ id: 123 });
    expect(global.fetch).toHaveBeenLastCalledWith('cometomemydear/test/123', { body: undefined, method: 'GET' });
  });

  test('throws an error when modelItem is not an object on add', () => {
    const testApi = new RequestModel('/test');
    expect(() => testApi.add(123)).toThrow(new TypeError('modelItem should be a object. Not a number'));
  });

  test('requests valid url with valid body and method with valid modelItem on add', () => {
    const testApi = new RequestModel('/test');
    testApi.add({ value: 'some' });
    expect(global.fetch).toHaveBeenLastCalledWith('cometomemydear/test', { body: JSON.stringify({ value: 'some' }), method: 'POST' });
  });

  test('throws an error when modelItem does not have id on update', () => {
    const testApi = new RequestModel('/test');
    expect(() => testApi.update(123)).toThrow('modelItem does not have id');
  });

  test('requests valid url with valid body and method with valid modelItem on update', () => {
    const testApi = new RequestModel('/test');
    testApi.update({ value: 'some', id: 123 });
    expect(global.fetch).toHaveBeenLastCalledWith('cometomemydear/test/123', { body: JSON.stringify({ value: 'some', id: 123 }), method: 'PUT' });
  });

  test('throws an error when modelItem does not have id on delete', () => {
    const testApi = new RequestModel('/test');
    expect(() => testApi.delete(123)).toThrow('modelItem does not have id');
  });

  test('requests valid url with valid body and method with valid modelItem on update', () => {
    const testApi = new RequestModel('/test');
    testApi.delete({ value: 'some', id: 123 });
    expect(global.fetch).toHaveBeenLastCalledWith('cometomemydear/test/123', { body: JSON.stringify({ value: 'some', id: 123 }), method: 'DELETE' });
  });

  test('throws an error when modelItem is not an object on addOrUpdate', () => {
    const testApi = new RequestModel('/test');
    expect(() => testApi.addOrUpdate(123)).toThrow(new TypeError('modelItem should be a object. Not a number'));
  });

  test('adds modelItem when it hasnt id on addOrUpdate', () => {
    const testApi = new RequestModel('/test');
    testApi.addOrUpdate({ value: 'some' });
    expect(global.fetch).toHaveBeenLastCalledWith('cometomemydear/test', { body: JSON.stringify({ value: 'some' }), method: 'POST' });
  });

  test('updates modelItem when it has id on addOrUpdate', () => {
    const testApi = new RequestModel('/test');
    testApi.addOrUpdate({ value: 'some', id: 123 });
    expect(global.fetch).toHaveBeenLastCalledWith('cometomemydear/test/123', { body: JSON.stringify({ value: 'some', id: 123 }), method: 'PUT' });
  });
});
