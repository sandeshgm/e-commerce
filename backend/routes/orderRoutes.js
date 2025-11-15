const express = require("express");
const {
  createOrder,
  getOrders,
  deleteOrder,
} = require("../controllers/orderController");
const { checkAuthUser } = require("../middleware/checkAuthMiddleware");
const router = express.Router();

router.post("/createOrder", checkAuthUser, createOrder);
router.get("/getOrder", checkAuthUser, getOrders);
router.delete("/:id", checkAuthUser, deleteOrder);

module.exports = router;
