require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const path = require('path');

// Import models
require('./models/User');
require('./models/Flashcard');

// Import routes (we'll create these next)
const flashcardRoutes = require('./routes/flashcards');
const authRoutes = require('./routes/auth');

const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? '*' : 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Routes
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/auth', authRoutes);

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

async function initializeDatabase() {
    try {
        // Connect to MongoDB using Mongoose
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            maxPoolSize: 50,
            minPoolSize: 10,
            maxIdleTimeMS: 30000,
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true
            }
        });

        console.log("Successfully connected to MongoDB!");

        // Get the default connection
        const db = mongoose.connection;

        // Create collections if they don't exist
        const collections = ['users', 'flashcards'];
        for (const collectionName of collections) {
            try {
                const collectionExists = await db.db.listCollections({ name: collectionName }).hasNext();
                if (!collectionExists) {
                    await db.createCollection(collectionName);
                    console.log(`Created collection: ${collectionName}`);
                } else {
                    console.log(`Collection ${collectionName} already exists`);
                }
            } catch (error) {
                console.log(`Error checking/creating collection ${collectionName}:`, error.message);
            }
        }

        // Create indexes
        try {
            const User = mongoose.model('User');
            await User.collection.createIndex({ email: 1 }, { unique: true });
            await User.collection.createIndex({ username: 1 }, { unique: true });
            console.log('User indexes created');

            const Flashcard = mongoose.model('Flashcard');
            await Flashcard.collection.createIndex({ user: 1 });
            await Flashcard.collection.createIndex({ nextReview: 1 });
            console.log('Flashcard indexes created');
        } catch (error) {
            console.log('Error creating indexes:', error.message);
        }

        console.log('Database initialization completed successfully');
        return true;
    } catch (err) {
        console.error('Database initialization error:', err.message);
        if (err.name === 'MongoServerError') {
            console.error('MongoDB Server Error. Please check your connection and credentials.');
            console.error('Error details:', err);
        } else if (err.name === 'MongoServerSelectionError') {
            console.error('Could not connect to MongoDB. Please check your network connection and MongoDB Atlas status.');
        }
        return false;
    }
}

// Initialize database and start server
initializeDatabase().then((success) => {
    if (!success) {
        console.error('Failed to initialize database. Exiting...');
        process.exit(1);
    }

    // Error handling middleware
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ message: 'Something went wrong!' });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}); 