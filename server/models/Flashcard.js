const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    answer: {
        type: String,
        required: true,
        trim: true
    },
    box: {
        type: Number,
        default: 1,
        min: 1,
        max: 5
    },
    nextReview: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        trim: true,
        default: 'General'
    }
}, {
    timestamps: true
});

// Calculate next review date based on box number
flashcardSchema.methods.calculateNextReview = function() {
    const intervals = {
        1: 1,    // 1 day
        2: 2,    // 2 days
        3: 4,    // 4 days
        4: 8,    // 8 days
        5: 16    // 16 days
    };
    
    const days = intervals[this.box] || 1;
    this.nextReview = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    return this.nextReview;
};

// Method to handle correct answer
flashcardSchema.methods.handleCorrectAnswer = function() {
    if (this.box < 5) {
        this.box += 1;
    }
    this.calculateNextReview();
};

// Method to handle incorrect answer
flashcardSchema.methods.handleIncorrectAnswer = function() {
    this.box = 1;
    this.calculateNextReview();
};

module.exports = mongoose.model('Flashcard', flashcardSchema); 