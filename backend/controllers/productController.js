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
    const products = await Product.find({});
    res.status(200).json({
      message: "Data fetched successfull",
      products,
    });
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

module.exports = {
  addProducts,
  getProducts,
  deleteProducts,
  getProductById,
  updateProducts,
};
