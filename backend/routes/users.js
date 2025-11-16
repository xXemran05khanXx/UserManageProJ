const express = require('express');
const router = express.Router();
const User = require('../models/User');

function formatValidationErrors(err) {
  const errors = {};
  if (err.errors) {
    for (const key in err.errors) {
      errors[key] = err.errors[key].message;
    }
  }
  return errors;
}

// GET /api/users?q=search
router.get('/', async (req, res, next) => {
  try {
    const q = req.query.q;
    let filter = {};
    if (q) {
      const regex = new RegExp(q, 'i');
      filter = { $or: [ { name: regex }, { email: regex }, { mobile: regex }, { address: regex } ] };
    }
    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
});

// GET single
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// POST create
router.post('/', async (req, res, next) => {
  try {
    const { name, email, mobile, address } = req.body;

    const errors = {};
    if (!name || !name.trim()) errors.name = 'Name is required';
    if (!email || !email.trim()) errors.email = 'Email is required';
    if (!mobile || !mobile.trim()) errors.mobile = 'Mobile is required';
    if (!address || !address.trim()) errors.address = 'Address is required';
    if (Object.keys(errors).length) return res.status(400).json({ success: false, errors });

    const user = new User({ name: name.trim(), email: email.trim().toLowerCase(), mobile: mobile.trim(), address: address.trim() });
    await user.save();
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    if (err.code === 11000 && err.keyValue && err.keyValue.email) {
      return res.status(400).json({ success: false, errors: { email: 'Email must be unique' } });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, errors: formatValidationErrors(err) });
    }
    next(err);
  }
});

// PUT update
router.put('/:id', async (req, res, next) => {
  try {
    const { name, email, mobile, address } = req.body;
    const errors = {};
    if (!name || !name.trim()) errors.name = 'Name is required';
    if (!email || !email.trim()) errors.email = 'Email is required';
    if (!mobile || !mobile.trim()) errors.mobile = 'Mobile is required';
    if (!address || !address.trim()) errors.address = 'Address is required';
    if (Object.keys(errors).length) return res.status(400).json({ success: false, errors });

    const existingWithEmail = await User.findOne({ email: email.trim().toLowerCase(), _id: { $ne: req.params.id } });
    if (existingWithEmail) return res.status(400).json({ success: false, errors: { email: 'Email must be unique' } });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.name = name.trim();
    user.email = email.trim().toLowerCase();
    user.mobile = mobile.trim();
    user.address = address.trim();

    await user.save();
    res.json({ success: true, data: user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, errors: formatValidationErrors(err) });
    }
    next(err);
  }
});

// DELETE
router.delete('/:id', async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
