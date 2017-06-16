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

export function getWaterBody(text,waterbodies = []) {
  if (!text) {
    return;
  }
  let findAndClean = findTextAndReturnRemainder(text, "var waterbody =")
  if (findAndClean) {
    var result = eval(findAndClean);

    result.forEach((waterbody) => {
      waterbody.url = `https://wildlife.utah.gov/hotspots/detailed.php?id=${waterbody[3]}`
      // console.log(waterbody)
      waterbodies.push(waterbody)
    })
  }
  return waterbodies;
}
