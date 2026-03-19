const express = require('express');
const router = express.Router();
const callbackController = require('../controllers/callbackController');

router.get('/callbacks', callbackController.getCallbackByOriginatorId);

module.exports = router;