const mongoose = require("mongoose");

const userScheme = new mongoose.Schema(
    {
        nome: {type: String},
        nascimento: {type: String, required: false},
        email: {type: String},
        userID: {type: String, required: false},
        senha: {type: String},
        datacadastro: {type: String, required: false},
        isAdmin: {type: Boolean},
    }
);

const UserMongo = mongoose.model("usuario", userScheme);
  
module.exports = UserMongo;