const xml2js = require('xml2js');

const parser = new xml2js.Parser({
  explicitArray: false,
  tagNameProcessors: [xml2js.processors.stripPrefix]
});

async function parseTelebirrResult(xml) {
  try {
    const result = await parser.parseStringPromise(xml);

    const envelope = result.Envelope;
    const body = envelope.Body;
    const apiResult = body.Result;

    // Handle possible typo: Headver vs Header
    const header = apiResult.Header || apiResult.Headver;
    const resBody = apiResult.Body;

    const transactionResult = resBody.TransactionResult || {};

    return {
      success: resBody.ResultCode === '0',

      resultType: resBody.ResultType,
      resultCode: resBody.ResultCode,
      resultDesc: resBody.ResultDesc,

      transactionId: transactionResult.TransactionID || null,

      conversationId: header.ConversationID,
      originatorConversationId: header.OriginatorConversationID
    };

  } catch (error) {
    console.log("Error: " + error);
    throw new Error('Failed to parse Telebirr Result callback: ' + error.message);
  }
}

module.exports = {
  parseTelebirrResult
};