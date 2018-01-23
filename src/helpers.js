export const throwTypeError = (name, type, value) => {
  throw new TypeError(`${name} should be a ${type}. Not a ${typeof value}`);
};

export const checkString = (value, name) => {
  if (typeof value !== 'string') throwTypeError(name, 'string', value);
};

export const checkObject = (value, name) => {
  if (typeof value !== 'object') throwTypeError(name, 'object', value);
};

export const objectToUri = obj => (
  Object.keys(obj).map(key => (`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)).join('&')
);
