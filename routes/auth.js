const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register
router.post("/register", async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
    });

    const userSaved = await newUser.save();
    res.status(200).json(userSaved);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(400).json("User not found ~!");

    const validatePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validatePassword && res.status(400).json("Wrong Password!");

    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SEC,
      { expiresIn: "2d" }
    );

    const { password, ...others } = user._doc; // Hidden Password from Postman

    res.status(200).json({ accessToken, others });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
