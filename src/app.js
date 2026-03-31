const express = require('express');
const cors = require('cors');
require('dotenv').config();

const paymentRoutes = require('./routes/paymentRoutes');
const callbackRoutes = require('./routes/callbackRoutes');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.text({ type: '*/*' }));


app.use('/api', callbackRoutes);
app.use('/api/payments', paymentRoutes);

module.exports = app;
