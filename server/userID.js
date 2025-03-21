function createUserIDGenerator() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  
    return function generateUserID() {
      let userID = "";
      for (let i = 0; i < 10 ; i++) {
        userID += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return userID;
    };
  }
  
module.exports = createUserIDGenerator()