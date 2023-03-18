const mongoose = require("mongoose");

function connectToDatabase() {
    mongoose.connect("mongodb://localhost:27017/usuarios", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("Mongo conectado!");
    }).catch((error) => {
        return console.log("Erro na conexão com o banco ",error);
    })
}

module.exports = connectToDatabase;