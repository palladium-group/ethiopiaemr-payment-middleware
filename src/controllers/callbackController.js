const { getCallbacksByOriginatorId } = require('../services/callbackQueryService');
const { saveCallbackLog } = require('../services/callbackLogService');
const { parseTelebirrResult } = require('../services/telebirrResultParser');
const xml2js = require('xml2js');



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

exports.registerCallback = async (req, res) => {
  try {
    const resultXML = req.body;
    if (!resultXML) {
      return res.status(400).json({
        message: 'XML body is required'
      });
    }
    console.log("Input: " + resultXML);
    const parsedResult = await parseTelebirrResult(resultXML);
    //parsedResult.parsedData = parsedResult;
    parsedResult.raw_xml = resultXML;
    console.log("Parsed Result: " + JSON.stringify(parsedResult));
    const results = await saveCallbackLog(parsedResult);
    res.json(parsedResult);
     

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};