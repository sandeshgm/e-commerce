const Order = require('../models/Order');

const createOrder = async (req, res) => {
  
  await Order.create({
    user: req.authUser._id,
    ...req.body,
    totalPrice: 0,
  });
  res.status(200).json({
    message: 'Order created Successfully',
  });
};

const getOrders = async (req, res) => {
  const { page = 1, limit = 4 } = req.query;
  const sortByFilter = {};

  const filter = {
    user: req.authUser._id,
  };

  if (req.query.status) {
    sortByFilter.status = req.query.status;
  }

  const orders = await Order.find(filter)
    .sort(sortByFilter)
    .limit(limit)
    .skip((page - 1) * limit ?? 10);

  const total = await Order.countDocuments(filter);

  res.status(200).json({
    message: 'Orders fetched Successfully',
    data: {
      page,
      total,
      data: orders,
    },
  });
};

module.exports = {
  createOrder,
  getOrders,
};
