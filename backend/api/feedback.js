const mongoose = require('mongoose');
const cors = require('cors');
app.use(cors({ origin: '*' }));

// MongoDB connection
const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

// Feedback schema and model
const Feedback = mongoose.model(
  'Feedback',
  new mongoose.Schema({
    text: { type: String, required: true },
    studentName: { type: String, default: 'Anonymous' },
    timestamp: { type: Date, default: Date.now },
  })
);

module.exports = async (req, res) => {
  await connectDB();

  if (req.method === 'GET') {
    // Fetch all feedback
    const feedbacks = await Feedback.find();
    res.status(200).json(feedbacks);
  } else if (req.method === 'POST') {
    // Add new feedback
    const { text, studentName } = req.body;
    if (!text) return res.status(400).json({ message: 'Text is required' });

    const feedback = new Feedback({ text, studentName });
    await feedback.save();
    res.status(201).json({ message: 'Feedback added!' });
  } else if (req.method === 'DELETE') {
    // Delete feedback by ID
    const { id } = req.query;
    if (!id) return res.status(400).json({ message: 'ID is required' });

    await Feedback.findByIdAndDelete(id);
    res.status(200).json({ message: 'Feedback deleted!' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
