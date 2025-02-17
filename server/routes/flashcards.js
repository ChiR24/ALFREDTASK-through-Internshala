const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Flashcard = require('../models/Flashcard');

// Create a new flashcard
router.post('/', [
    auth,
    body('question').trim().notEmpty(),
    body('answer').trim().notEmpty(),
    body('category').optional().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const flashcard = new Flashcard({
            ...req.body,
            user: req.user._id,
            nextReview: new Date()
        });

        await flashcard.save();

        res.status(201).json(flashcard);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all flashcards due for review
router.get('/due', auth, async (req, res) => {
    try {
        const flashcards = await Flashcard.find({
            user: req.user._id,
            nextReview: { $lte: new Date() }
        }).sort('box');

        res.json(flashcards);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all flashcards
router.get('/', auth, async (req, res) => {
    try {
        const { category } = req.query;
        const query = { user: req.user._id };
        
        if (category) {
            query.category = category;
        }

        const flashcards = await Flashcard.find(query).sort('-createdAt');
        res.json(flashcards);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get flashcard by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const flashcard = await Flashcard.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!flashcard) {
            return res.status(404).json({ message: 'Flashcard not found' });
        }

        res.json(flashcard);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update flashcard review status
router.patch('/:id/review', [
    auth,
    body('isCorrect').isBoolean()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const flashcard = await Flashcard.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!flashcard) {
            return res.status(404).json({ message: 'Flashcard not found' });
        }

        if (req.body.isCorrect) {
            flashcard.handleCorrectAnswer();
        } else {
            flashcard.handleIncorrectAnswer();
        }

        await flashcard.save();
        res.json(flashcard);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update flashcard content
router.put('/:id', [
    auth,
    body('question').optional().trim().notEmpty(),
    body('answer').optional().trim().notEmpty(),
    body('category').optional().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const flashcard = await Flashcard.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!flashcard) {
            return res.status(404).json({ message: 'Flashcard not found' });
        }

        const updates = req.body;
        Object.keys(updates).forEach(key => {
            if (updates[key] !== undefined) {
                flashcard[key] = updates[key];
            }
        });

        await flashcard.save();
        res.json(flashcard);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete flashcard
router.delete('/:id', auth, async (req, res) => {
    try {
        const flashcard = await Flashcard.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!flashcard) {
            return res.status(404).json({ message: 'Flashcard not found' });
        }

        res.json({ message: 'Flashcard deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get statistics
router.get('/stats/summary', auth, async (req, res) => {
    try {
        // Get today's start and end
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Get last 30 days for streak calculation
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Get activity data for streak calculation
        const activityData = await Flashcard.aggregate([
            {
                $match: {
                    user: req.user._id,
                    updatedAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": -1 } }
        ]);

        // Calculate current streak
        let currentStreak = 0;
        let date = new Date(today);
        
        while (true) {
            const dateStr = date.toISOString().split('T')[0];
            const dayActivity = activityData.find(d => d._id === dateStr);
            
            if (!dayActivity) break;
            currentStreak++;
            date.setDate(date.getDate() - 1);
        }

        const stats = await Flashcard.aggregate([
            { $match: { user: req.user._id } },
            {
                $group: {
                    _id: null,
                    totalCards: { $sum: 1 },
                    boxCounts: {
                        $push: {
                            box: '$box',
                            count: 1
                        }
                    },
                    dueToday: {
                        $sum: {
                            $cond: [
                                { $lte: ['$nextReview', new Date()] },
                                1,
                                0
                            ]
                        }
                    },
                    reviewedToday: {
                        $sum: {
                            $cond: [
                                { 
                                    $and: [
                                        { $gte: ['$updatedAt', today] },
                                        { $lt: ['$updatedAt', tomorrow] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        const boxStats = [1, 2, 3, 4, 5].map(box => ({
            box,
            count: stats[0]?.boxCounts.filter(b => b.box === box).length || 0
        }));

        // Calculate today's progress
        const totalDueToday = stats[0]?.dueToday || 0;
        const reviewedToday = stats[0]?.reviewedToday || 0;
        
        // More stable progress calculation
        let todayProgress = 0;
        if (totalDueToday === 0) {
            // If there are no cards due, progress is 100%
            todayProgress = 100;
        } else if (reviewedToday >= totalDueToday) {
            // If all due cards are reviewed, progress is 100%
            todayProgress = 100;
        } else {
            // Calculate progress percentage, rounded to nearest integer
            todayProgress = Math.round((reviewedToday / totalDueToday) * 100);
        }

        // Transform activity data into a map
        const activityMap = activityData.reduce((acc, day) => {
            acc[day._id] = day.count;
            return acc;
        }, {});

        res.json({
            totalCards: stats[0]?.totalCards || 0,
            dueToday: totalDueToday,
            reviewedToday,
            todayProgress,
            currentStreak,
            activityData: activityMap,
            boxStats
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get mastered flashcards for quiz
router.get('/mastered', auth, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const flashcards = await Flashcard.aggregate([
            { $match: { 
                user: req.user._id,
                box: 5 // Only mastered cards (box 5)
            }},
            { $sample: { size: limit } } // Random selection
        ]);
        
        res.json(flashcards);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 