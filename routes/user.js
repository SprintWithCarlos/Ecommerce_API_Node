const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

// Update User
router.put("/:id", verifyTokenAndAuthorization, async (req, res, next) => {
  if (req.body.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    } catch (error) {
      res.status(400).json(error);
    }
  }

  try {
    const updateUser = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json(updateUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete User
router.delete(
  "/delete/:id",
  verifyTokenAndAuthorization,
  async (req, res, next) => {
    try {
      const deleteUser = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User Deleted: " + deleteUser);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// Get User (Admin)
router.get("/get/:id", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const getUser = await User.findById({ _id: req.params.id });
    res.status(200).json("Admin Get User: " + getUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get All User (Admin)
router.get("/", verifyTokenAndAdmin, async (req, res, next) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get User Stats (Admin) verifyTokenAndAuthorization verifyTokenAndAdmin
router.get("/stats", verifyTokenAndAdmin, async (req, res, next) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      { $project: { month: { $month: "$createdAt" } } },
      { $group: { _id: "$month", total: { $sum: 1 } } },
    ]);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
