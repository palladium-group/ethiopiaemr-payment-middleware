function buildTelebirrRequest({
  originatorConversationId,
  msisdn,
  amount,
  currency
}) {
  return `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:api="http://cps.huawei.com/cpsinterface/api_requestmgr" xmlns:req="http://cps.huawei.com/cpsinterface/request" xmlns:com="http://cps.huawei.com/cpsinterface/common">
   <soapenv:Header/>
   <soapenv:Body>
      <api:Request>
         <req:Header>
            <req:Version>1.0</req:Version>
            <req:CommandID>InitTrans_BuyGoodsForCustomer</req:CommandID>
            <req:OriginatorConversationID>${originatorConversationId}</req:OriginatorConversationID>
            <req:Caller>
              <req:CallerType>2</req:CallerType>
              <req:ThirdPartyID>${process.env.THIRD_PARTY_ID}</req:ThirdPartyID>
              <req:Password>${process.env.PASSWORD}</req:Password>
              <req:ResultURL>http://10.180.70.177:30001/payment/services/APIRequestMgrService</req:ResultURL>
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