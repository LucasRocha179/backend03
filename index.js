const express = require("express");
const app = express();
const request = require("request");

const connectToDatabase = require("./database/database");

const usuario = require("./router/usuario.router");
const User = require("./model/usuario");

const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  // const url = req.body.url;

  // request(url, function(error, response, body){
  //   console.log('statusCode: ', response && response.statusCode);

  //   const resposta = JSON.parse(body);

  //   res.send(resposta);
  // })
  res.send("Seja bem-vindo!");
});

app.use("/usuario", usuario);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  connectToDatabase();
});
