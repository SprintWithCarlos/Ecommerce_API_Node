const router = require("express").Router();
const Cart = require("../models/Cart");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
} = require("./verifyToken");

// Create Cart
router.post("/create", verifyToken, async (req, res, next) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update Cart
router.put("/:id", verifyTokenAndAuthorization, async (req, res, next) => {
  try {
    const updateCart = await Cart.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json(updateCart);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete Cart
router.delete(
  "/delete/:id",
  verifyTokenAndAuthorization,
  async (req, res, next) => {
    try {
      const deleteCart = await Cart.findByIdAndDelete(req.params.id);
      res.status(200).json("Cart Deleted: " + deleteCart);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// Get User Cart
router.get(
  "/get/:userId",
  verifyTokenAndAuthorization,
  async (req, res, next) => {
    try {
      const getCart = await Cart.findOne({ userId: req.params.userId });
      res.status(200).json(getCart);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// Get All Cart
router.get("/", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const carts = await Cart.find();
    res.status(500).json(carts);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
