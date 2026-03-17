const xml2js = require('xml2js');

const parser = new xml2js.Parser({
  explicitArray: false
});

const builder = new xml2js.Builder();

async function parseXml(xml) {
  return await parser.parseStringPromise(xml);
}

function buildXml(json) {
  return builder.buildObject(json);
}

module.exports = {
  parseXml,
  buildXml
};
