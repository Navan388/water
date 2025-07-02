const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');

// ✅ Create new order
router.post('/', authMiddleware, async (req, res) => {
  const { items, deliveryDate } = req.body;

  if (!items || items.length === 0 || !deliveryDate) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // 🔢 Calculate total
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      totalAmount += product.price * item.quantity;
    }

    const order = await Order.create({
      userId: req.user.id,
      items,
      deliveryDate,
      totalAmount,
      paymentStatus: 'Paid', // or 'Pending' if payment gateway used
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order', error: err.message });
  }
});

// ✅ Get current user's orders
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('items.productId', 'name price quantityInLiters createdBy')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
});

// ✅ Get merchant's received orders
router.get('/merchant', authMiddleware, async (req, res) => {
  if (req.user.role !== 'merchant') {
    return res.status(403).json({ message: 'Only merchants can access this route' });
  }

  try {
    const orders = await Order.find()
      .populate({
        path: 'items.productId',
        match: { createdBy: req.user.id },
        select: 'name price quantityInLiters',
      })
      .populate('userId', 'email')
      .sort({ createdAt: -1 });

    // 🔍 Filter out orders where none of the products belong to this merchant
    const merchantOrders = orders.filter((order) =>
      order.items.some((item) => item.productId !== null)
    );

    res.json(merchantOrders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch merchant orders', error: err.message });
  }
});

// ⚠️ Optional: Delivery personnel route (if needed)
// router.get('/delivery', authMiddleware, async (req, res) => {});

module.exports = router;
