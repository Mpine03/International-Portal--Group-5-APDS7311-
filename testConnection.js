require('dotenv').config(); // Load environment variables
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGO_URI; // Use your MongoDB URI from the .env file

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function testConnection() {
  try {
    // Attempt to connect to the MongoDB server
    await client.connect();
    console.log('MongoDB connected successfully!');

    // Optionally, ping the database to confirm
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. MongoDB is up and running!');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
  } finally {
    // Close the connection
    await client.close();
    console.log('Connection closed');
  }
}

// Run the test connection function
testConnection().catch(console.dir);
