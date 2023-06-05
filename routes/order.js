const express = require("express");
const router = express.Router();
const { AddOrder, GetOrders } = require("../controllers/orderController");

router.route("/").post(AddOrder).get(GetOrders);

module.exports = router;