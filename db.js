const mongoose = require('mongoose');

// set environment variables file
require('dotenv').config();


// set mon. Url
const mongoUrl = process.env.MONGOURL;

//connect to Mongo
mongoose.connect(mongoUrl);

// object of connections of Mongo
const db = mongoose.connection;

//event listener
db.on('connected', () => {
    console.log("Database connected");
})

db.on('disconnected', () => {
    console.log("disconnected from database");

})

db.on('error', (err) => {
    console.log("Error: " + err);
});

// export function
module.exports = db;

