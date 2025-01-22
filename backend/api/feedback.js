const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const app = express();

// CORS Configuration: Only allow your GitHub Pages URL
app.use(cors({ origin: 'https://blakeschafer.github.io' }));

app.options('*', cors());

// MongoDB connection
const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

// Feedback Schema and Model
const Feedback = mongoose.model(
  'Feedback',
  new mongoose.Schema({
    text: { type: String, required: true },
    studentName: { type: String, default: 'Anonymous' },
    timestamp: { type: Date, default: Date.now },
  })
);

app.use(express.json()); // Parse JSON body

// API Routes
app.get('/api/feedback', async (req, res) => {
  await connectDB();
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch feedback', error: err.message });
  }
});

app.post('/api/feedback', async (req, res) => {
  await connectDB();
  try {
    const { text, studentName } = req.body;
    if (!text) return res.status(400).json({ message: 'Text is required' });

    const feedback = new Feedback({ text, studentName });
    await feedback.save();
    res.status(201).json({ message: 'Feedback added!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save feedback', error: err.message });
  }
});

module.exports = app;
