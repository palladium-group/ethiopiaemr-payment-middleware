const paymentService = require('../services/paymentService');
const telebirrService = require('../services/telebirrService');
const crypto = require('crypto');
const { parseTelebirrResponse } = require('../services/telebirrParser');
const { parseTelebirrResult } = require('../services/telebirrResultParser');
const { saveCallbackLog } = require('../services/callbackLogService');

function generateSecure12Digit() {
  const bytes = crypto.randomBytes(6); // 6 bytes = 12 hex chars approx
  const num = BigInt('0x' + bytes.toString('hex'));
  return (num % 1000000000000n).toString().padStart(12, '0');
}

exports.getPayments = async (req, res) => {
  const payments = await paymentService.getPayments();
  res.json(payments);
};

exports.createPayment = async (req, res) => {
  const unixMillis = Date.now();
  const xml = telebirrService.buildTelebirrRequest ({
    conversationId: req.body.conversationId,//"TX" + generateSecure12Digit(),
    thirdPartyId: process.env.THIRD_PARTY_ID,
    password: process.env.PASSWORD,
    resultUrl: process.env.RESULT_URL,
    timestamp: unixMillis,
    initiatorId: process.env.INITIATOR_ID,
    securityCredential: process.env.SECURITY_CREDENTIAL,
    shortCode: process.env.SHORT_CODE,
    msisdn: req.body.mobileNumber,
    receiver: process.env.RECEIVER,
    amount: req.body.amount
  });
  res.set('Content-Type', 'text/xml');
  res.send(xml);
};

exports.handleTelebirrResponse = async (req, res) => {

  const xml = req.body; // raw XML
  const parsed = await parseTelebirrResponse(xml);

  if (parsed.success) {
    // update DB transaction status
  }

  res.json(parsed);
};

exports.handleTelebirrCallback = async (req, res) => {
  const xml = req.body;

  try {
    const parsed = await parseTelebirrResult(xml);

    await saveCallbackLog({
      provider: 'telebirr',
      conversationId: parsed.conversationId,
      originatorConversationId: parsed.originatorConversationId,
      transactionId: parsed.transactionId,
      resultCode: parsed.resultCode,
      resultDesc: parsed.resultDesc,
      rawXml: xml,
      parsedData: parsed   // store parsed JSON
    });

    res.status(200).send('OK');

  } catch (error) {
    console.error('Callback processing failed:', error);

    await saveCallbackLog({
      provider: 'telebirr',
      conversationId: null,
      originatorConversationId: null,
      transactionId: null,
      resultCode: 'ERROR',
      resultDesc: error.message,
      rawXml: xml,
      parsedData: null   // or you can store partial data if available
    });

    res.status(500).send('ERROR');
  }
};