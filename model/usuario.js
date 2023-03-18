const mongoose = require("mongoose");

const userScheme = new mongoose.Schema(
    {
        nome: {type: String, required: true},
        nascimento: {type: String, required: false},
        email: {type: String, required: true, unique: true},
        userID: {type: String, required: true},
        senha: {type: String, required: true},
        datacadastro: {type: String, required: false},
        isAdmin: {type: Boolean, required: false},
        token: {type: String, required: true}
    }
);

const UserMongo = mongoose.model("usuario", userScheme);
  
module.exports = UserMongo;