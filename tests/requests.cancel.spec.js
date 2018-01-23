const api = require('../src/settings');
const { successResponse } = require('./helpers');


describe.skip('Cancel previous request', () => {
  /*
    TODO:

    previous request is not canceled when key is not provided and configured to false
    previous request is not canceled when key is false and configured to false
    previous request is not canceled when key is false and configured to true
    previous request is canceled when key is true and configured to false
    previous request is canceled when key is true and configured to true
    previous request is canceled when key is null and configured to true

    tests cancelKey
  */

  beforeAll(() => {
    global.fetch = jest.fn().mockImplementation(successResponse);
  });

  describe('request is not canceled when only 1 made when', () => {
    test('shouldCancelPreviousRequest=true and CONFIG is falsy', () => {
      api.setConfig('cometomemydear');
      expect(api.get('123', null, true)).resolves.toBe('works');
    });

    test('shouldCancelPreviousRequest=null and CONFIG is falsy', () => {
      api.setConfig('cometomemydear');
      expect(api.get('123', null)).resolves.toBe('works');
    });

    test('shouldCancelPreviousRequest=false and CONFIG is falsy', () => {
      api.setConfig('cometomemydear');
      expect(api.get('123', null)).resolves.toBe('works');
    });

    test('shouldCancelPreviousRequest=true and CONFIG is true', () => {
      api.setConfig('cometomemydear', true);
      expect(api.get('123', null, true)).resolves.toBe('works');
    });

    test('shouldCancelPreviousRequest=null and CONFIG is true', () => {
      api.setConfig('cometomemydear', true);
      expect(api.get('123', null)).resolves.toBe('works');
    });

    test('shouldCancelPreviousRequest=false and CONFIG is true', () => {
      api.setConfig('cometomemydear', true);
      expect(api.get('123', null)).resolves.toBe('works');
    });
  });
});
