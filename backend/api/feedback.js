const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const app = express();

// At the top of your routes, add explicit OPTIONS handling
app.options('/api/feedback', cors());

// Modify your CORS setup slightly
app.use(cors({
    origin: 'https://blakeschafer.github.io',  // Remove the array and just use the main URL
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// MongoDB connection with error handling
const connectDB = async () => {
    if (mongoose.connection.readyState === 0) {
        try {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('MongoDB connected successfully');
        } catch (error) {
            console.error('MongoDB connection error:', error);
            throw error;
        }
    }
};

// Feedback Schema and Model
const FeedbackSchema = new mongoose.Schema({
    text: { type: String, required: true },
    studentName: { type: String, default: 'Anonymous' },
    timestamp: { type: Date, default: Date.now },
    tag: { type: String, default: 'feedback' }
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);

// Middleware
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!', error: err.message });
});

// API Routes
app.get('/api/feedback', async (req, res) => {
    try {
        await connectDB();
        const feedbacks = await Feedback.find().sort({ timestamp: -1 });
        res.status(200).json(feedbacks);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch feedback', error: err.message });
    }
});

app.post('/api/feedback', async (req, res) => {
    try {
        await connectDB();
        const { text, studentName, tag } = req.body;
        
        if (!text) {
            return res.status(400).json({ message: 'Text is required' });
        }

        const feedback = new Feedback({ 
            text, 
            studentName: studentName || 'Anonymous',
            tag: tag || 'feedback'
        });

        await feedback.save();
        res.status(201).json({ message: 'Feedback added successfully!', feedback });
    } catch (err) {
        res.status(500).json({ message: 'Failed to save feedback', error: err.message });
    }
});

module.exports = app;

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
