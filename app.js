const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sentimentRoutes = require('./routes/sentimentRoutes');

// Middleware
app.use(bodyParser.json());

// Sentiment analysis routes
app.use('/api/sentiment', sentimentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
});

module.exports = app;