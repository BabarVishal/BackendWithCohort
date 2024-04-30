const mongoose = require('mongoose');
require('dotenv').config()


const serverURL = process.env.MONGODB_URI;
console.log("MongoDB URI:", serverURL);


mongoose.connect(serverURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

db.on('connected', ()=>{
    console.log('Conected to the mongo db server!');
})

db.on('error', (err) =>{
    console.log('mongo connection error', err);
})

db.on('discanected', ()=>{
    console.log('its discanected');
})

module.exports = db;