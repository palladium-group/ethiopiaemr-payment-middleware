const paymentService = require('../services/paymentService');
const { sendToTelebirr } = require('../services/telebirrService');
const { buildTelebirrRequest } = require('../services/telebirrRequestBuilder');
const { parseTelebirrResponse } = require('../services/telebirrParser');

const axios = require('axios');
const TELEBIRR_URL = process.env.TELEBIRR_API_URL;

exports.getPayments = async (req, res) => {
  const payments = await paymentService.getPayments();
  res.json(payments);
};

exports.createPayment = async (req, res) => {
  const unixMillis = Date.now();
  try{
    const xmlRequest = buildTelebirrRequest ({
      originatorConversationId: req.body.conversationId,
      msisdn: req.body.mobileNumber,
      amount: req.body.amount,
      currency: "ETB"
    });
    //console.log("XML Request: " + xmlRequest);
    // Call Telebirr
    const xmlResponse = await sendToTelebirr(xmlRequest);
    //const apiCallResponse = {"response": xmlResponse, "request": xmlRequest};
     res.set('Content-Type', 'text/xml');
     res.send(xmlResponse);
    // Parse response
    //const parsed = await parseTelebirrResponse(xmlResponse);

    /*res.json({
      originatorConversationId,
      telebirrResponse: parsed
    });*/

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
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
