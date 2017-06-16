import 'isomorphic-fetch';

import { request } from '../app/api/fishing';


test('fishing', async () => {
  const data = await request()
  expect(Array.isArray(data)).toBeTruthy();
  expect(data.length > 0).toBeTruthy();
})
