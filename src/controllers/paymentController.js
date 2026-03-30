const paymentService = require('../services/paymentService');
const telebirrService = require('../services/telebirrService');
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
    const xmlRequest = telebirrService.buildTelebirrRequest ({
      originatorConversationId: req.body.conversationId,
      msisdn: req.body.mobileNumber,
      amount: req.body.amount,
      currency: "ETB"
    });
    
    // Call Telebirr
    const xmlResponse = await sendToTelebirr(xmlRequest);

    // Parse response
    const parsed = await parseTelebirrResponse(xmlResponse);

    res.json({
      originatorConversationId,
      telebirrResponse: parsed
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Payment initiation failed' });
  }
};

