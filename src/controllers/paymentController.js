const paymentService = require('../services/paymentService');

exports.getPayments = async (req, res) => {
  const payments = await paymentService.getPayments();
  res.json(payments);
};

exports.createPayment = async (req, res) => {
  const payment = await paymentService.createPayment(req.body);
  res.json(payment);
};
