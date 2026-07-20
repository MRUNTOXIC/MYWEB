const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/team', require('./routes/team'));
app.use('/api/internet', require('./routes/internet'));
app.use('/api/submission', require('./routes/submission'));
app.use('/api/announcements', require('./routes/announcements'));

app.use(errorHandler);

module.exports = app;
