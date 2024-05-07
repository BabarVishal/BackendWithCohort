// app.js
import mongoose from 'mongoose'; // Import mongoose using ES6 module syntax
import dotenv from 'dotenv'; // Import dotenv using ES6 module syntax

dotenv.config();

const serverURL = process.env.MONGODB_URI;
console.log("MongoDB URI:", serverURL);

mongoose.connect(serverURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Connected to the MongoDB server!');
});

db.on('error', (err) => {
    console.log('MongoDB connection error', err);
});

db.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

export default db; // Export db as the default export
