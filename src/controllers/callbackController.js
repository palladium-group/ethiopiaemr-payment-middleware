const { getCallbacksByOriginatorId } = require('../services/callbackQueryService');

exports.getCallbackByOriginatorId = async (req, res) => {
  try {
    const { originator_conversation_id } = req.query;

    if (!originator_conversation_id) {
      return res.status(400).json({
        message: 'originator_conversation_id is required'
      });
    }

    const results = await getCallbacksByOriginatorId(originator_conversation_id);

    res.json(results.length > 0 ? results[0] : null);

  } catch (error) {
    console.error('Error fetching callback logs:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};