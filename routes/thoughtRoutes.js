const { User, Thought } = require('../models');
const express = require('express');
const router = express.Router();

// Helper function for error handling
const handleError = (res, err) => {
	console.error(err);
	res
		.status(500)
		.json({ message: 'Internal server error', error: err.message });
};

// Retrieve all thoughts from the database
router.get('/', async (req, res) => {
	try {
		const thoughts = await Thought.find();
		res.json(thoughts);
	} catch (err) {
		handleError(res, err);
	}
});

// Retrieve a single thought by its unique identifier
router.get('/:id', async (req, res) => {
	try {
		const thought = await Thought.findById(req.params.id);
		if (!thought) {
			return res
				.status(404)
				.json({ message: 'Thought not found with this ID' });
		}
		res.json(thought);
	} catch (err) {
		handleError(res, err);
	}
});

// Create a new thought and associate it with a user
router.post('/', async (req, res) => {
	try {
		const newThought = await Thought.create(req.body);
		await User.findByIdAndUpdate(
			req.body.userId,
			{ $push: { thoughts: newThought._id } },
			{ new: true }
		);
		res.json(newThought);
	} catch (err) {
		handleError(res, err);
	}
});

// Update an existing thought by its unique identifier
router.put('/:id', async (req, res) => {
	try {
		const updatedThought = await Thought.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		if (!updatedThought) {
			return res
				.status(404)
				.json({ message: 'Thought not found with this ID' });
		}
		res.json(updatedThought);
	} catch (err) {
		handleError(res, err);
	}
});

// Delete a thought by its unique identifier
router.delete('/:id', async (req, res) => {
	try {
		const deletedThought = await Thought.findByIdAndDelete(req.params.id);
		if (!deletedThought) {
			return res
				.status(404)
				.json({ message: 'Thought not found with this ID' });
		}
		res.json(deletedThought);
	} catch (err) {
		handleError(res, err);
	}
});

// Add a reaction to a specific thought's reactions array
router.post('/:thoughtId/reactions', async (req, res) => {
	try {
		const updatedThought = await Thought.findByIdAndUpdate(
			req.params.thoughtId,
			{ $push: { reactions: req.body } },
			{ new: true }
		);
		if (!updatedThought) {
			return res
				.status(404)
				.json({ message: 'Thought not found with this ID' });
		}
		res.json(updatedThought);
	} catch (err) {
		handleError(res, err);
	}
});

// Remove a reaction from a thought by reaction's unique identifier
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
	try {
		const updatedThought = await Thought.findByIdAndUpdate(
			req.params.thoughtId,
			{ $pull: { reactions: { reactionId: req.params.reactionId } } },
			{ new: true }
		);
		if (!updatedThought) {
			return res
				.status(404)
				.json({ message: 'Thought not found with this ID' });
		}
		res.json(updatedThought);
	} catch (err) {
		handleError(res, err);
	}
});

module.exports = router;
