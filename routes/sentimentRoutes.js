const express = require('express');
const router = express.Router();
const sentimentController = require('../controllers/sentimentController');
const { authenticateUser } = require('../middleware/authMiddleware');

// Route for analyzing content sentiment
router.post('/analyze', authenticateUser, sentimentController.analyzeBlogContent);

module.exports = router;
