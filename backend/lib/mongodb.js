const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

let client;
let db;

async function getDb() {
  if (db) return db;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  client = new MongoClient(uri);
  await client.connect();
  db = client.db('elixa');
  console.log('[DB] Connected to MongoDB Atlas — elixa');
  return db;
}

async function closeDb() {
  if (client) {
    await client.close();
    db = null;
    client = null;
  }
}

module.exports = { getDb, closeDb };
