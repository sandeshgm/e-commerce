const express = require('express');
const { createOrder, getOrders } = require('../controllers/orderController');
const { checkAuthUser } = require('../middleware/checkAuthMiddleware');
const router = express.Router();

router.post('/', checkAuthUser, createOrder);
router.get('/', checkAuthUser, getOrders);

module.exports = router;