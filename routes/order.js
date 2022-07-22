const router = require("express").Router();
const Order = require("../models/Order");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
} = require("./verifyToken");

// Create Order
router.post("/", verifyToken, async (req, res, next) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update Order
router.put("/:id", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const updateOrder = await Order.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json(updateOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete Order (Admin)
router.delete("/delete/:id", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const deleteOrder = await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order Deleted: " + deleteOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get User Orders
router.get(
  "/get/:userId",
  verifyTokenAndAuthorization,
  async (req, res, next) => {
    try {
      const getOrder = await Order.find({ userId: req.params.userId });
      res.status(200).json(getOrder);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// Get All Order (Admin)
router.get("/", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.status(500).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get Monthly Income (Admin)
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const productId = req.query.pid;
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
          ...(productId && {
            products: { $elemMatch: { productId } },
          }),
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
