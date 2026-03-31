const axios = require('axios');


const TELEBIRR_URL = process.env.TELEBIRR_API_URL;


// SOAP headers required by Telebirr
const headers = {
  'Content-Type': 'text/xml;charset=UTF-8'
};

async function sendToTelebirr(xmlPayload) {
  try {
    const response = await axios.post(
      TELEBIRR_URL,
      xmlPayload,
      { headers, timeout: 3000 }
    );

    return response; // raw XML response

  } catch (error) {
    if (error) {
       // Telebirr responded with error status
       //return error.response.data;
       return error;
    }
    
    // Network or timeout error
    throw new Error('Telebirr API call failed: ' + error.message);
  }
}

module.exports = {
  sendToTelebirr
};