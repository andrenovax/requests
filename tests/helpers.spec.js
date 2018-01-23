const helpers = require('../src/helpers');


describe('Helpers', () => {
  test('throwTypeError throws correct error message', () => {
    expect(() => helpers.throwTypeError('a', 'b', 123)).toThrow(new TypeError('a should be a b. Not a number'));
  });

  test('checkString throws correct error message', () => {
    expect(() => helpers.checkString(123, 'a')).toThrow(new TypeError('a should be a string. Not a number'));
  });

  test('checkObject throws correct error message', () => {
    expect(() => helpers.checkObject(123, 'a')).toThrow(new TypeError('a should be a object. Not a number'));
  });

  test('objectToUri parses object to uri correctly', () => {
    expect(helpers.objectToUri({ a: 'b', c: 12, d: true })).toBe('a=b&c=12&d=true');
  });
});
