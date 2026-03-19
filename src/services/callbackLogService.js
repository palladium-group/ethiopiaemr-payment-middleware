const db = require('../config/db');

async function saveCallbackLog(data) {
  const query = `
    INSERT INTO provider_callback_log (
      provider,
      conversation_id,
      originator_conversation_id,
      transaction_id,
      result_code,
      result_desc,
      raw_xml,
      parsed_data
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `;

  const values = [
    data.provider,
    data.conversationId,
    data.originatorConversationId,
    data.transactionId,
    data.resultCode,
    data.resultDesc,
    data.rawXml,
    data.parsedData ? JSON.stringify(data.parsedData) : null
  ];

  await db.query(query, values);
}

module.exports = {
  saveCallbackLog
};