const { User, Thought } = require('../models');
const express = require('express');
const router = express.Router();

// Helper function for error handling
const handleError = (res, err) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error.', error: err.message });
};

// Retrieve all users along with their thoughts and friends
router.get('/', async (req, res) => {
  try {
    const users = await User.find().populate('thoughts').populate('friends');
    res.json(users);
  } catch (err) {
    handleError(res, err);
  }
});

// Retrieve a single user by its unique identifier along with their thoughts and friends
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('thoughts').populate('friends');
    if (!user) {
      return res.status(404).json({ message: 'User not found with this ID' });
    }
    res.json(user);
  } catch (err) {
    handleError(res, err);
  }
});

// Create a new user
router.post('/', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } catch (err) {
    handleError(res, err);
  }
});

// Update an existing user by its unique identifier
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found with this ID' });
    }
    res.json(updatedUser);
  } catch (err) {
    handleError(res, err);
  }
});

// Delete a user by its unique identifier
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found with this ID' });
    }
    res.json(deletedUser);
  } catch (err) {
    handleError(res, err);
  }
});

// Add a friend to a user's friend list
router.post('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found with this ID' });
    }
    res.json(user);
  } catch (err) {
    handleError(res, err);
  }
});

// Remove a friend from a user's friend list
router.delete('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { friends: req.params.friendId } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found with this ID' });
    }
    res.json(user);
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;
