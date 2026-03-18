const express = require('express');
const cors = require('cors');

const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.text({ type: '*/*' }));

app.use('/api/payments', paymentRoutes);

module.exports = app;
