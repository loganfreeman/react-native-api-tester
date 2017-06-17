import 'isomorphic-fetch';

import { request } from '../app/api/trails';

let originalTimeout;

function increateTimeout() {
  originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
}

function restoreTimeout() {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
}
beforeEach(() => {
  increateTimeout();
});

afterEach(() => {
  restoreTimeout();
});

test('trails', async () => {
  const data = await request(84094)
  expect(Array.isArray(data)).toBeTruthy();
  expect(data.length > 0).toBeTruthy();
})
