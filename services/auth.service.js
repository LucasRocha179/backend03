const UserMongo = require("../model/usuario");
const jwt = require("jsonwebtoken");

const loginService = (email) => UserMongo.findOne({ email });

const udpateToken = (user) => {
    const userID = user.userID;
  return UserMongo.findOneAndUpdate({userID}, user, {
    returnDocument: "after",
  });
};

const generateToken = (user, segredo) => {
    return jwt.sign(user, segredo);
};

module.exports = { loginService, udpateToken, generateToken, };
