const express = require("express");
require("dotenv").config();

const cors = require("cors");
const connectDb = require("./config/db.js");

const app = express();
const port = 3007;

const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const productRoutes = require("./routes/product.Routes.js");
const orderRoutes = require("./routes/orderRoutes.js");

//middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

//DB
connectDb();

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/order", orderRoutes);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
