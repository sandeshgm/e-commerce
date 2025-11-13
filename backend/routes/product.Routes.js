const express = require("express");
const {
  addProducts,
  getProducts,
  getProductById,
  deleteProducts,
  updateProducts,
} = require("../controllers/productController");
const router = express.Router();
const multer = require("multer");
const { checkAuthAdmin } = require("../middleware/checkAuthMiddleware");

//image upload products image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "productsImage/");
  },
  filename: function (req, file, cb) {
    const fileExtension = file.mimetype.split("/")[1];
    cb(null, Date.now() + "." + fileExtension);
  },
});
const upload = multer({ storage: storage });

router.post("/", upload.single("image"), addProducts);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.delete("/:id", checkAuthAdmin, deleteProducts);
router.patch("/:id", upload.single("image"), checkAuthAdmin, updateProducts);

module.exports = router;
