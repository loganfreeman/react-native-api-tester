import 'isomorphic-fetch';
import { checkNewReleases } from '../app/api/github'

test('checkNewReleases', async () => {
  expect.assertions(1);
  const data = await checkNewReleases();
  expect(Array.isArray(data)).toBeTruthy();
});
