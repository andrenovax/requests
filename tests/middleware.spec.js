const { middleware } = require('../src/middleware');


describe('Default response middleware', () => {
  test('returns JSON on success', () => {
    const jsonResponse = new Promise((resolve) => { resolve({ json: () => ({ iam: 'json' }) }); });

    expect(middleware(jsonResponse)).resolves.toMatchObject({ iam: 'json' });
  });

  test('returns 500 error as "Server Error"', () => {
    const errorResponse = new Promise((resolve, reject) => { reject({ code: 500 }); });

    expect(middleware(errorResponse)).resolves.toMatchObject({ error: 'Server Error' });
  });

  test('returns 404 error as "Server Error"', () => {
    const errorResponse = new Promise((resolve, reject) => { reject({ code: 404 }); });

    expect(middleware(errorResponse)).resolves.toMatchObject({ error: 'Server Error' });
  });

  test('returns others error "error message"', () => {
    const errorResponse = new Promise((resolve, reject) => { reject({ code: 401, json: () => 'Not Authorized' }); });

    expect(middleware(errorResponse)).resolves.toMatchObject({ error: 'Not Authorized' });
  });

  test('returns server error when no "json" error available on error', () => {
    const errorResponse = new Promise((resolve, reject) => { reject({ code: 401 }); });

    expect(middleware(errorResponse)).resolves.toMatchObject({ error: 'Server Error' });
  });

  test('returns body when no "json" data available on success', () => {
    const noJsonResponse = new Promise((resolve) => { resolve({ body: 'done' }); });

    expect(middleware(noJsonResponse)).resolves.toBe('done');
  });

  test('returns canceled response on canceled response', () => {
    const canceledResponse = new Promise((resolve, reject) => { reject({ isCanceled: true, error: 'test' }); });

    expect(middleware(canceledResponse)).resolves.toMatchObject({ isCanceled: true, error: 'test' });
  });
});
