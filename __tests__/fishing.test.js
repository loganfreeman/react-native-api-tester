import 'isomorphic-fetch';

import cheerio from 'cheerio';

import { getWaterBody, UTAH_FISHING_URL, request } from '../app/api/fishing';


test('fishing', async () => {
  const html = await request()
  let $ = cheerio.load(html);

  $('script').each((index, element) => {
    getWaterBody($(element).html());
  });
})
