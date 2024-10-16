require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

// Create an instance of Express
const app = express();

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection URI
const uri = process.env.MONGO_URI;

// Create a MongoClient instance
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Connect to MongoDB and return the connected client
async function connectToDB() {
  try {
    await client.connect();
    console.log('MongoDB connected!');
    return client.db('testDatabase'); // Change this to your actual database name
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1); // Exit process with failure
  }
}

// Route to test MongoDB connection and insert a document
app.post('/api/users', async (req, res) => {
  const db = await connectToDB();
  const collection = db.collection('users');

  // Insert a document into the users collection
  const user = req.body; // Expecting JSON with user info
  try {
    const result = await collection.insertOne(user);
    res.status(201).json({ success: true, insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Route to fetch a user by name
app.get('/api/users/:name', async (req, res) => {
  const db = await connectToDB();
  const collection = db.collection('users');

  try {
    const user = await collection.findOne({ name: req.params.name });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Basic route for the home page
app.get('/', (req, res) => {
  res.send('Welcome to the MongoDB API!');
});

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const csrf = require('csurf');
app.use(csrf());

const helmet = require('helmet');
app.use(helmet());

app.use(session({
  secret: 'session_secret',
  cookie: { secure: true, httpOnly: true, sameSite: 'strict' }
}));
