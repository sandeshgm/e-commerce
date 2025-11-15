const Order = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products in order" });
    }

    let totalPrice = 0;

    // Fetch product price from DB
    for (const item of products) {
      const productData = await Product.findById(item.product);

      if (!productData) {
        return res.status(404).json({ message: "Product not found" });
      }

      totalPrice += productData.price * item.quantity;

      // Store full product object inside order
      item.product = productData;
    }

    const newOrder = await Order.create({
      user: req.authUser.userId,
      products,
      totalPrice,
      status: "pending",
    });

    res.status(200).json({
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (error) {
    console.error("Order creation error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
const getOrders = async (req, res) => {
  try {
    const userId = req.authUser.userId;

    const { page = 1, limit = 4 } = req.query;

    const filter = { user: userId };

    const sortByFilter = {};
    if (req.query.status) {
      sortByFilter.status = req.query.status;
    }

    const orders = await Order.find(filter)
      .sort(sortByFilter)
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      message: "Orders fetched Successfully",
      data: {
        page,
        total,
        data: orders,
      },
    });
  } catch (error) {
    console.log("Get Orders Error:", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deleteOrder = async (req, res) => {
  await Order.deleteOne({ _id: req.params.id });
  res.status(200).json({
    message: "Deleted successfully",
  });
};

module.exports = {
  createOrder,
  getOrders,
  deleteOrder,
};
