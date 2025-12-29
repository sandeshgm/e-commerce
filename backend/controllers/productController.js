const Product = require("../models/Product");

const addProducts = async (req, res) => {
  try {
    const product = await Product.create({
      name: req.body.name,
      price: req.body.price,
      image: req?.file?.filename,
      description: req.body.description,
    });
    res.status(200).json({
      message: "Product Added Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 8,
      search = "",
      order,
      minPrice,
      maxPrice,
    } = req.query;

    const filter = {};

    if (search) {
      filter.name = new RegExp(search, "i");
    }

    if (minPrice && maxPrice) {
      filter.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    }

    const sortByFilter = {};
    if (order) {
      sortByFilter.price = order === "desc" ? -1 : 1;
    }

    const products = await Product.find(filter)
      .sort(sortByFilter)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Product.countDocuments(filter);
    res.status(200).json({
      message: "Data fetched successfull",
      products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
    console.log({ page: Number(page), limit: Number(limit) });
    console.log("Products returned:", products.length);
  } catch (error) {
    console.log("error in getting products", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).json({ message: "Not found" });
    res.status(200).json({ message: "data fetched succesfully", product });
  } catch (error) {
    console.log("error fetching product by id:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteProducts = async (req, res) => {
  try {
    await Product.deleteOne({ _id: req.params.id });
    res.status(200).json({
      message: "Deleted successfully",
    });
  } catch (error) {
    console.log("error in deleting", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateProducts = async (req, res) => {
  try {
    const updateProduct = await Product.updateOne(
      { _id: req.params.id },
      { ...req.body, image: req?.file?.filename }
    );

    res.status(200).json({ message: "Updated successfully" }, updateProduct);
  } catch (error) {
    console.log("error in update data");
    res.status(500).json({
      message: "Server error",
    });
  }
};

const getFeaturedProducts = async (req, res) => {
  const products = await Product.find({ featured: true }).limit(4);
  res.status(200).json({
    message: "Product fetched successfully",
    data: products,
  });
};

const getLatestPRoducts = async (req, res) => {
  const products = await Product.find().sort({ createdAt: "desc" }).limit(4);
  res.status(200).json({
    message: "Product fetched successfully",
    data: products,
  });
};

module.exports = {
  addProducts,
  getProducts,
  deleteProducts,
  getProductById,
  updateProducts,
  getFeaturedProducts,
  getLatestPRoducts,
};
