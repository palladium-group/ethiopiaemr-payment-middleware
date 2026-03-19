const db = require('../config/db');

async function getCallbacksByOriginatorId(originatorConversationId) {
  const query = `
    SELECT 
      id,
      provider,
      conversation_id,
      originator_conversation_id,
      transaction_id,
      result_code,
      result_desc AS result_description
    FROM provider_callback_log
    WHERE originator_conversation_id = $1
    ORDER BY created_at DESC
  `;

  const { rows } = await db.query(query, [originatorConversationId]);
  return rows;
}

module.exports = {
  getCallbacksByOriginatorId
};