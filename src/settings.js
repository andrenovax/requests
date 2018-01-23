import responseParserMiddleware from './middleware';
import { checkString, throwTypeError } from './helpers';

export const CONFIG = {
  apiUrl: '',
  shouldCancelPreviousRequest: false,
};

export const MIDDLEWARE = {
  request: [],
  response: [responseParserMiddleware],
};

export const setConfig = (apiUrl, shouldCancelPreviousRequest = false) => {
  checkString(apiUrl, 'apiUrl');

  if (typeof shouldCancelPreviousRequest !== 'boolean') {
    throwTypeError('shouldCancelPreviousRequest', 'boolean', shouldCancelPreviousRequest);
  }

  CONFIG.apiUrl = apiUrl;
  CONFIG.shouldCancelPreviousRequest = shouldCancelPreviousRequest;

  // disallow changing CONFIG after setup
  Object.freeze(CONFIG);
  return CONFIG;
};

export const setMiddleware = ({ requests, responses }) => {
  MIDDLEWARE.request = [];
  MIDDLEWARE.response = [responseParserMiddleware];

  if (!Array.isArray(requests)) {
    throwTypeError('requests', 'array', requests);
  }

  if (!Array.isArray(responses)) {
    throwTypeError('responses', 'array', responses);
  }

  if (!requests.length && !responses.length) {
    throw new Error('no request nor response middleware provided');
  }

  [[requests, 'request'], [responses, 'response']]
    .forEach(([middlewares, type]) => {
      middlewares.forEach((m) => {
        if (typeof m !== 'function') {
          throwTypeError(`${type} middleware`, 'function', m);
        }
        MIDDLEWARE[type].push(m);
      });

      // disallow changing request and response middleware after setup
      Object.freeze(MIDDLEWARE[type]);
    });

  // disallow changing middleware object after setup
  Object.freeze(MIDDLEWARE);

  return MIDDLEWARE;
};
