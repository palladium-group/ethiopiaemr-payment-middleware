//const { create } = require('xmlbuilder2');
const { parseTelebirrResult } = require('../services/telebirrResultParser.js');
const { saveCallbackLog } = require('../services/callbackLogService');

function buildTelebirrRequest({
  originatorConversationId,
  msisdn,
  amount,
  currency
}) {
  return `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:api="http://cps.huawei.com/cpsinterface/api_requestmgr"
                  xmlns:req="http://cps.huawei.com/cpsinterface/request" 
                  xmlns:com="http://cps.huawei.com/cpsinterface/common">
    <soapenv:Header/>
    <soapenv:Body>
      <api:Request>
         <req:Header>
            <req:Version>1.0</api:Version>
            <req:CommandID>InitTrans_BuyGoodsForCustomer</req:CommandID>
            <req:OriginatorConversationID>${originatorConversationId}</req:OriginatorConversationID>
            <req:Caller>
              <req:CallerType>2</req:CallerType>
              <req:ThirdPartyID>${process.env.TELEBIRR_THIRD_PARTY_ID}</req:ThirdPartyID>
              <req:Password>${process.env.TELEBIRR_PASSWORD}</req:Password>
              <req:ResultURL>http://10.180.73.190:8003/mockAPIResultMgrBinding</req:ResultURL>
            </req:Caller>
            <req:KeyOwner>1</req:KeyOwner>
            <req:Timestamp>${new Date().toISOString()}</req:Timestamp>            
          </req:Header>
          <req:Body>
            <req:Identity>
              <req:Initiator>
                <req:IdentifierType>12</req:IdentifierType>
                <req:Identifier>${process.env.INITIATOR_ID}</req:Identifier>
                <req:SecurityCredential>${process.env.SECURITY_CREDENTIAL}</req:SecurityCredential>
                <req:ShortCode>${process.env.SHORT_CODE}</req:ShortCode>  
              </req:Initiator>

              <req:PrimaryParty>
                <req:IdentifierType>1</req:IdentifierType>
                <req:Identifier>${msisdn}</req:Identifier>
              </req:PrimaryParty>
              <req:ReceiverParty>
                <req:IdentifierType>4</req:IdentifierType>
                <req:Identifier>${process.env.INITIATOR_ID}</req:Identifier>
              </req:ReceiverParty>
            </req:Identity>
            <req:TransactionRequest>
               <req:Parameters>
                  <req:Amount>${amount}</req:Amount>
                  <req:Currency>${currency}</req:Currency>
               </req:Parameters>
            </req:TransactionRequest>
         </req:Body>
      </api:Request>
   </soapenv:Body>
</soapenv:Envelope>
  `.trim();
}

module.exports = {
  buildTelebirrRequest
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

// SOAP headers required by Telebirr
const headers = {
  'Content-Type': 'text/xml;charset=UTF-8'
};

async function sendToTelebirr(xmlPayload) {
  try {
    const response = await axios.post(
      TELEBIRR_URL,
      xmlPayload,
      { headers, timeout: 30000 }
    );

    return response.data; // raw XML response

  } catch (error) {
    if (error.response) {
      // Telebirr responded with error status
      return error.response.data;
    }

    // Network or timeout error
    throw new Error('Telebirr API call failed: ' + error.message);
  }
}

module.exports = {
  sendToTelebirr
};