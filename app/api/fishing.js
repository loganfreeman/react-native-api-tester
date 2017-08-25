import cheerio from 'cheerio';

export const UTAH_FISHING_URL = "https://wildlife.utah.gov/hotspots/";


export function request() {
  return fetch(UTAH_FISHING_URL).then(raw => raw.text())
  .then(html => {
    let $ = cheerio.load(html);
    let waterbodies = [];
    $('script').each((index, element) => {
      getWaterBody($(element).html(), waterbodies);
    });
    return waterbodies;
  })
}

function findTextAndReturnRemainder(target, variable) {
  let index = target.search(variable);
  if(index == -1) {
    return null;
  }
  let chopFront = target.substring(index + variable.length, target.length);
  let result = chopFront.substring(0, chopFront.search(";"));
  return result;
}

function getRating(status) {
  let ratings = {
    "Good": 3,
    "Hot": 4,
    "Fair": 2,
    "Slow": 1,
    "Closed": 0,
    "No recent report": 0
  }
  return ratings[status];
}

function getDirectionUrl(latitude, longitude) {
  return `http://maps.google.com/?q=${latitude},${longitude}`
}

export function getWaterBody(text,waterbodies = []) {
  if (!text) {
    return;
  }
  let findAndClean = findTextAndReturnRemainder(text, "var waterbody =")
  if (findAndClean) {
    var result = eval(findAndClean);

    result.forEach((waterbody) => {
      console.log(waterbody);
      let url = `https://wildlife.utah.gov/hotspots/detailed.php?id=${waterbody[3]}`;
      let item = {
        title: waterbody[0],
        latitude: waterbody[1],
        longitude: waterbody[2],
        status: waterbody[4],
        rate: getRating(waterbody[4]),
        kind: waterbody[5],
        link: url,
        direction: getDirectionUrl(waterbody[1], waterbody[2])
      };
      console.log(item);
      waterbodies.push(item);
    })
  }
  return waterbodies;
}
