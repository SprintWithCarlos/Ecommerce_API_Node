const router = require("express").Router();
const Product = require("../models/Product");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

// Create Product
router.post("/create", verifyTokenAndAdmin, async (req, res, next) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update Product
router.put("/:id", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const updateProduct = await Product.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json(updateProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete Product
router.delete("/delete/:id", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const deleteProduct = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product Deleted: " + deleteProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get Product (Admin)
router.get("/get/:id", async (req, res, next) => {
  try {
    const getProduct = await Product.findById({ _id: req.params.id });
    res.status(200).json("Admin Get Product: " + getProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get All Product (Admin)
router.get("/", async (req, res, next) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;

  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
