const express = require('express');
const router = express.Router();

const { cardPayment } = require("../controllers/paymentController");

router.route("/").post(cardPayment);

module.exports = router;

