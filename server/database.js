const mongoose = require('mongoose');
const dotenv = require("dotenv")

dotenv.config()

db_url = process.env.database_url
//Set up default mongoose connection
var mongoDB = db_url;

const connecToDB = async ()=>{
    await mongoose.connect(mongoDB);
    console.log("Connected to database");
}

module.exports = connecToDB;