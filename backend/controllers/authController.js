const mongoose = require("mongoose");
const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwtToken = require("../config/jsonWebToken.js");

// register new User
const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({
        message: "User already exists",
      });
      return;
    }

    //hash password
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    //create new User
    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
    });

    // generate JWT
    const token = jwtToken(newUser._id, res);

    //remove password before sending
    const { password: _, ...userWithoutPassword } = newUser.toObject();

    res.status(201).json({
      message: "User Successfully register",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const logIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    //check if user exists or not
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    //compare password
    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
      return res
        .status(400)
        .json({ message: "email or password doesnot match" });
    }

    //generate JWT
    const token = jwtToken(user._id, res);

    //removfe passpord form sending
    const { password: _, ...userWithoutPassword } = user.toObject();

    return res.status(200).json({
      message: "User login successfull",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("error in login", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const logOut = async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({
    message: "User logout successfully",
  });
};

module.exports = {
  register,
  logIn,
  logOut,
};
