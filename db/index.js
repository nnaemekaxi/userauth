const mongoose = require("mongoose");
require("dotenv").config();
const {MONGO_URI} = process.env;

async function connect(){
    try {
        mongoose.connect(MONGO_URI);
        console.log("Database Connected!")
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = connect;