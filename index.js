const express = require("express");
const app = express();
// const request = require("request");
const authService = require("./services/auth.service");
const jwt = require("jsonwebtoken");

const connectToDatabase = require("./database/database");

const usuario = require("./router/usuario.router");
const segredo = require("./utils/constants");

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

app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await authService.loginService(email);

    if (!user) {
      return res
        .status(400)
        .send({ message: "Usuário não encontrado, tente novamente!" });
    }
    if (senha != user.senha) {
      return res.status(400).send({ message: "Senha inválida!" });
    }
    const token = authService.generateToken({ user }, segredo);
    //await authService.udpateToken(user);

    res.status(200).send({ user, token });
  } catch (err) {
    console.log(`erro: ${err}`);
  }
});

app.get("/teste-token", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(400).send({ message: "O Token não foi informado!" });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return res.status(401).send({ message: "token inválido!" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ message: "token mal formatado!" });
  }

  jwt.verify(token, segredo, async (err, decoded) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Erro interno! Tente novamente mais tarde!" });
    }
    return res.status(200).send(decoded);
  });
});

//função validar está desativada por enquanto pois não estamos mais salvando o token no banco
app.post("/validar", async (req, res) => {
  try {
    const { email, token } = req.body;
    const user = await authService.loginService(email);

    if (!user) {
      return res
        .status(400)
        .send({ message: "Usuário não encontrado, tente novamente!" });
    }
    if (token != user.token) {
      return res
        .status(400)
        .send({ message: "Token incorreto ou expirado, tente novamente!" });
    }
    user.token = "";
    await authService.udpateToken(user);

    res.status(200).send(user);
  } catch (err) {
    console.log(`erro: ${err}`);
  }
});

// const token = function(){
//   let token = Math.random().toString(36).substring(2);
//   return token;
// };

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  connectToDatabase();
});
