const Payment = require('../models/paymentModel');

exports.createPayment = async (req, res) => {
  const { recipientAccount, amount, currency, swiftCode } = req.body;
  try {
    const payment = await Payment.create({
      userId: req.user.id,
      recipientAccount,
      amount,
      currency,
      swiftCode
    });
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
