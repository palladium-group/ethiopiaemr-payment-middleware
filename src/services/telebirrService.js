const { create } = require('xmlbuilder2');

function buildTelebirrRequest(data) {

const xml = create({ version: '1.0' })
.ele('soapenv:Envelope', {
  'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
  'xmlns:api': 'http://cps.huawei.com/cpsinterface/api_requestmgr',
  'xmlns:req': 'http://cps.huawei.com/cpsinterface/request',
  'xmlns:com': 'http://cps.huawei.com/cpsinterface/common'
})

.ele('soapenv:Header').up()

.ele('soapenv:Body')
.ele('api:Request')

.ele('req:Header')
.ele('req:Version').txt('1.0').up()
.ele('req:CommandID').txt('InitTrans_BuyGoodsForCustomer').up()
.ele('req:OriginatorConversationID').txt(data.conversationId).up()

.ele('req:Caller')
.ele('req:CallerType').txt('2').up()
.ele('req:ThirdPartyID').txt(data.thirdPartyId).up()
.ele('req:Password').txt(data.password).up()
.ele('req:ResultURL').txt(data.resultUrl).up()
.up()

.ele('req:KeyOwner').txt('1').up()
.ele('req:Timestamp').txt(data.timestamp).up()
.up()

.ele('req:Body')

.ele('req:Identity')

.ele('req:Initiator')
.ele('req:IdentifierType').txt('12').up()
.ele('req:Identifier').txt(data.initiatorId).up()
.ele('req:SecurityCredential').txt(data.securityCredential).up()
.ele('req:ShortCode').txt(data.shortCode).up()
.up()

.ele('req:PrimaryParty')
.ele('req:IdentifierType').txt('1').up()
.ele('req:Identifier').txt(data.msisdn).up()
.up()

.ele('req:ReceiverParty')
.ele('req:IdentifierType').txt('4').up()
.ele('req:Identifier').txt(data.receiver).up()
.up()

.up()

.ele('req:TransactionRequest')

.ele('req:Parameters')
.ele('req:Amount').txt(data.amount).up()
.ele('req:Currency').txt('ETB').up()
.up()

.up()
.up()
.up()
.up();

return xml.end({ prettyPrint: false });

}

module.exports = { buildTelebirrRequest };
