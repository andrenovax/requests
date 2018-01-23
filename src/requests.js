import { checkString, objectToUri } from './helpers';
import { CONFIG, MIDDLEWARE } from './settings';

const requests = {};

const cancelRequest = (key, timeRequested, response) => {
  if (requests[key] !== timeRequested) {
    const msg = `${key} request is canceled by the next request`;
    console.warn(msg);
    return Promise.reject({ isCanceled: true, error: msg });
  }

  return response;
};

const requestWithMiddleware = (url, config = {}, cancelKey) => {
  let [urlToGo, configToGo] = [url, config];
  if (MIDDLEWARE.request.length) {
    MIDDLEWARE.request.forEach((cb) => {
      [urlToGo, configToGo] = cb(urlToGo, configToGo);
    });
  }

  let req = fetch(urlToGo, configToGo);

  if (cancelKey) {
    const timeRequested = new Date();
    requests[cancelKey] = timeRequested;
    req = req
      .then(
        response => cancelRequest(cancelKey, timeRequested, response),
        response => cancelRequest(cancelKey, timeRequested, response),
      );
  }

  if (MIDDLEWARE.response.length) {
    MIDDLEWARE.response.forEach((cb) => {
      req = cb(req);
    });
  }

  return req;
};

const requestRel = (url, method, body, cancelKey) => {
  checkString(url, 'url');
  if (!body && method !== 'GET') throw new Error(`body is required to make a ${method} request`);

  const params = { method, body: body && JSON.stringify(body) };
  return requestWithMiddleware(CONFIG.apiUrl + url, params, cancelKey);
};

export const get = (url, params = false, shouldCancelPreviousRequest = null, cancelKey = url) => {
  let urlToGo = url;
  if (params) {
    const paramsType = typeof params;
    if (paramsType === 'object') urlToGo += `?${objectToUri(params)}`;
    else if (paramsType === 'string') urlToGo += `?${params}`;
    else throw new Error(`url params should be a string or object. Not a ${paramsType}`);
  }

  if (shouldCancelPreviousRequest) {
    return requestRel(urlToGo, 'GET', null, cancelKey);
  }

  return requestRel(urlToGo, 'GET');
};

export const post = (url, body) => requestRel(url, 'POST', body);

export const put = (url, body) => requestRel(url, 'PUT', body);

export const del = (url, body) => requestRel(url, 'DELETE', body);

export const abs = (url, params = { method: 'GET' }, shouldCancelPreviousRequest = CONFIG.shouldCancelPreviousRequest, cancelKey = url) => {
  checkString(url, 'url');

  if (params !== null && typeof params !== 'object') {
    throw new Error(`config should be an object. Not a ${typeof params}`);
  }

  const isCancelable = params.method === 'GET' && shouldCancelPreviousRequest;

  return requestWithMiddleware(url, params, isCancelable && cancelKey);
};
