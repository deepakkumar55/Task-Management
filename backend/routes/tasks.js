const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.userId });
        res.json(tasks);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});


router.post('/', authMiddleware, async (req, res) => {
    const { title, description, status, dueDate, category } = req.body;
    const task = new Task({ title, description, status, dueDate, category, userId: req.user.userId });
    try {
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});



router.put('/:id', authMiddleware, async (req, res) => {
    const { title, description, status, dueDate, category } = req.body;
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, { title, description, status, dueDate, category }, { new: true });
        res.json(updatedTask);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).send('Server Error');
    }
});




router.get('/category/:category', authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.userId, category: req.params.category });
        res.json(tasks);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
