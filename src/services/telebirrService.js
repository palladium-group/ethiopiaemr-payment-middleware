const axios = require('axios');


const TELEBIRR_URL = "https://10.180.70.177:30002/payment/services/APIRequestMgrService";//process.env.TELEBIRR_API_URL;


// SOAP headers required by Telebirr
const headers = {
  'Content-Type': 'text/xml;charset=UTF-8'
};
const https = require('https');

const agent = new https.Agent({
  rejectUnauthorized: false // ❗ disables certificate validation
});

async function sendToTelebirr(xmlPayload) {
  try {
    const response = await axios.post(
      TELEBIRR_URL,
      xmlPayload,
      { 
        headers: { 'Content-Type': 'text/xml' },
        httpsAgent: agent,
        timeout: 3000 
      }
    );

    return response; // raw XML response

  } catch (error) {
    if (error) {
       // Telebirr responded with error status
       //return error.response.data;
       return error;
    }
    
    // Network or timeout error
    throw new Error('Telebirr API call failed: ' + error);
  }
}

module.exports = {
  sendToTelebirr
};