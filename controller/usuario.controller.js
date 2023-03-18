const UserMongo = require("../model/usuario");

class Usuario {
  constructor(nome, nascimento, email, senha, isAdmin = true) {
    this.nome = this.validarNome(nome);
    this.nascimento = this.validarData(nascimento);
    this.email = this.validarEmail(email);
    this.userID = this.criaUserID(email);
    this.senha = this.validarSenha(senha);
    this.datacadastro = this.getData();
    this.isAdmin = isAdmin;
  }

  validarNome(nome) {
    if (!nome) {
      throw new Error("Campo nome é obrigatório");
    }
    return nome;
  }

  validarData(data) {
    if (!this.isDataValida(data)) {
      throw new Error("Data de nascimento inválida. Use o formato DD/MM/AAAA.");
    }
    return data;
  }

  isDataValida(data) {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(data)) {
      return false;
    }
    const [dia, mes, ano] = data.split("/");
    const dataObj = new Date(ano, mes - 1, dia);
    const dataValida =
      dataObj.getFullYear() == ano &&
      dataObj.getMonth() == mes - 1 &&
      dataObj.getDate() == dia;
    return dataValida;
  }

  criaUserID(email) {
    const encodedEmail = Buffer.from(email).toString("base64");
    return encodedEmail;
  }

  validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      throw new Error("Endereço de email inválido.");
    }
    return email;
  }

  validarSenha(senha) {
    if (!senha) {
      throw new Error("Campo senha é obrigatório!");
    }
    return senha;
  }

  getData() {
    const date = new Date();
    return date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "numeric",
    });
  }
}

const findAll = async (req, res) => {
  console.log("requested findAllUsers");
  return res.status(200).send(await UserMongo.find());
};

const find = async (req, res) => {
  try {
    const id = req.params.id;
    if (id == null) {
      return res.send({ message: "parametro vazio!" });
    }
    console.log(`requested findUser ${req.params.id}`);
    const usuario = await UserMongo.findById(id);
    if (usuario == null) {
      return res.status(404).send("Usuário não encontrado!");
    }
    return res.status(200).send(await UserMongo.findById(id));
  } catch (err) {
    return res
      .status(500)
      .send("Erro no servidor, tente novamente mais tarde!");
  }
};

const create = async (req, res) => {
  if (req.body.nome == null) {
    return res.send({ message: "request body vazio!" });
  }
  try {
    const user = req.body;
    const usuario = new Usuario(
      user.nome,
      user.nascimento,
      user.email,
      user.senha
    );
    console.log(`LOG: ${usuario.datacadastro} novo usuário ${usuario.userID}`);
    res.status(201).send(await UserMongo.create(usuario));
  } catch (e) {
    return res.status(400).send({ message: e.message });
  }
};

const update = async (req, res) => {
  if (req.params.id == null) {
    return res.send({ message: "parametro vazio!" });
  }
  const id = req.params.id;
  const user = req.body;

  try {
    const usuario = new Usuario(
      user.nome,
      user.nascimento,
      user.email,
      user.senha
    );
    res.status(201).send(
      await UserMongo.findByIdAndUpdate(id, usuario, {
        returnDocument: "after",
      })
    );
    console.log(`LOG: ${usuario.nome} editado!`);
  } catch (e) {
    return res.status(400).send({ message: e.message });
  }
};

const deleteUser = async (req, res) => {
  try{
      if (req.params.id == null) {
      return res.send({ message: "parametro vazio!" });
    }
    const id = req.params.id;

    console.log(`LOG: Usuário ${id} excluído!`);
    return res
      .status(200)
      .send(await UserMongo.findByIdAndRemove(id, { returnDocument: "after" }));
  } catch (err) {
    return res
      .status(500)
      .send("Erro no servidor, tente novamente mais tarde!");
  }
};

module.exports = {
  findAll,
  find,
  create,
  update,
  deleteUser,
};
