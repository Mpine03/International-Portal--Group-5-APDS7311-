const express = require('express');
const { createPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/payment', protect, createPayment);

module.exports = router;
