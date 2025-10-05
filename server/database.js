const mongoose = require('mongoose');
const dotenv = require("dotenv")

dotenv.config()

const db_url = process.env.database_url


const connecToDB = async ()=>{
    await mongoose.connect(db_url);
    console.log("Connected to database");
}

module.exports = connecToDB;