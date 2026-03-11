const db = require('../config/db');

exports.getPayments = async () => {
  const result = await db.query('SELECT * FROM payment_transaction');
  return result.rows;
};

exports.createPayment = async (data) => {
  const result = await db.query(
    `INSERT INTO payment_transaction(amount, provider)
     VALUES($1, $2) RETURNING *`,
    [data.amount, data.provider]
  );

  return result.rows[0];
};
