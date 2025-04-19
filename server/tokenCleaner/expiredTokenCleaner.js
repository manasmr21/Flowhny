const cron = require("node-cron");
const jwt = require("jsonwebtoken");
const userDb = require("../Schema/userSchema");
const dotenv = require("dotenv");

dotenv.config()

const key = process.env.auth_token_key

const cleanExpiredTokens = ()=>{
    cron.schedule("0 0 * * *", async()=>{
        try {
            const user = await userDb.find({ "tokens.0": { $exists: true } });
    
        for (const user of users) {
            const validTokens = [];
      
            for (const tokenObj of user.tokens) {
              try {
                jwt.verify(tokenObj.token, SECRET);
                validTokens.push(tokenObj);
              } catch (err) {
                if (err.name === "TokenExpiredError") {
                  console.log(`Expired token removed for user: ${user.username}`);
                } else {
                  console.log(`Other token error for user ${user.username}:`, err.message);
                }
              }
            }
    
              // Only update if some tokens were removed
          if (validTokens.length !== user.tokens.length) {
            user.tokens = validTokens;
            await user.save();
          }
        }
    
        console.log("Expired tokens cleared successfully");
        } catch (error) {
            console.log(error.message);
        }
    
    })
}

module.exports = cleanExpiredTokens