const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/paymentController');

router.get('/', paymentController.getPayments);
router.post('/', paymentController.createPayment);
router.post('/response', paymentController.handleTelebirrResponse);
router.post('/telebirr/callback', paymentController.handleTelebirrCallback);
module.exports = router;
