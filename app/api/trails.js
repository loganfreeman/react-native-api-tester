import cheerio from 'cheerio';

import phantom from 'phantom';

const ALLTRAILS_EXPLORE_URL = "https://www.alltrails.com/explore?q=";

const ALLTRAILS_HOME_URL = "https://www.alltrails.com";

export function request(zipcode) {
  return phantom.create(['--ignore-ssl-errors=yes', '--load-images=no'], {
    logLevel: 'info'
  }).then(ph => {
      _ph = ph;
      return _ph.createPage();
  }).then(page => {
      _page = page;
      return _page.open(`${ALLTRAILS_EXPLORE_URL}${zipcode}`);
  }).then(status => {
      return _page.property('content')
  }).then(content => {
      //console.log(content);
      let data = parseHtml(content);
      _page.close();
      _ph.exit();
      return data;
  })
}

function parseHtml(html) {
  let $ = cheerio.load(html);

  let trails = [];

  $('.trail-result-card').each((index, element) => {
    let image = $(element).children('link[itemprop="image"]').attr('href');
    let url = $(element).children('a[itemprop="url"]').attr('href');
    let title = $('div[itemprop="name"]', '.item-info', element).text();

    let difficulty = $('.difficulty-info', '.item-info', element).children('.diff').text();

    let location = $('.location-label', '.item-info', element).text();

    let metadata = {
      image: `${ALLTRAILS_HOME_URL}${image}`,
      url: `${ALLTRAILS_HOME_URL}${url}`,
      title: title,
      difficulty: difficulty,
      location: location
    }

    trails.push(metadata);
  })

  return trails;
}
