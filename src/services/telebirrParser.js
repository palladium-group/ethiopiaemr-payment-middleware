const xml2js = require('xml2js');

const parser = new xml2js.Parser({
  explicitArray: false,
  tagNameProcessors: [xml2js.processors.stripPrefix] // removes soapenv:, res:, api:
});

async function parseTelebirrResponse(xml) {
  try {
    const result = await parser.parseStringPromise(xml);

    // Navigate SOAP structure
    const envelope = result.Envelope;
    const body = envelope.Body;
    const response = body.Response;

    const header = response.Header;
    const resBody = response.Body;

    return {
      success: resBody.ResponseCode === '0',

      responseCode: resBody.ResponseCode,
      responseDesc: resBody.ResponseDesc,
      serviceStatus: resBody.ServiceStatus,

      conversationId: header.ConversationID,
      originatorConversationId: header.OriginatorConversationID
    };

  } catch (error) {
    throw new Error('Failed to parse Telebirr response: ' + error.message);
  }
}

module.exports = {
  parseTelebirrResponse
};