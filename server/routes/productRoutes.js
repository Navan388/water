const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');

// 🟢 Public: All products with merchant email
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('createdBy', 'email');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load products', error: err.message });
  }
});

// 🔐 Merchant-only: View own products
router.get('/merchant', authMiddleware, async (req, res) => {
  if (req.user.role !== 'merchant') {
    return res.status(403).json({ message: 'Only merchants can view their products' });
  }

  try {
    const products = await Product.find({ createdBy: req.user.id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch merchant products', error: err.message });
  }
});

// 🔐 Merchant-only: Add product
router.post('/add', authMiddleware, async (req, res) => {
  if (req.user.role !== 'merchant') {
    return res.status(403).json({ message: 'Only merchants can add products' });
  }

  const { name, quantityInLiters, price } = req.body;

  if (
    !name || typeof name !== 'string' ||
    typeof quantityInLiters !== 'number' ||
    typeof price !== 'number'
  ) {
    return res.status(400).json({ message: 'Invalid fields' });
  }

  try {
    const product = await Product.create({
      name: name.trim(),
      quantityInLiters,
      price,
      createdBy: req.user.id,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add product', error: err.message });
  }
});

// 🔐 Merchant-only: Edit product
router.put('/:id', authMiddleware, async (req, res) => {
  const { name, quantityInLiters, price } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    if (product.createdBy.toString() !== req.user.id || req.user.role !== 'merchant') {
      return res.status(403).json({ message: 'Unauthorized to edit this product' });
    }

    if (name) product.name = name.trim();
    if (typeof quantityInLiters === 'number') product.quantityInLiters = quantityInLiters;
    if (typeof price === 'number') product.price = price;

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
});

// 🔐 Merchant-only: Delete product
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    if (product.createdBy.toString() !== req.user.id || req.user.role !== 'merchant') {
      return res.status(403).json({ message: 'Unauthorized to delete this product' });
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
});

module.exports = router;
