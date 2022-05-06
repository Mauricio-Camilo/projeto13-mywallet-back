import express, { json } from "express";
import { MongoClient, ObjectId } from "mongodb";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";
import joi from "joi";
import bcrypt from "bcrypt";

dotenv.config();

const Port = process.env.PORT;
const Database = process.env.DATABASE;
const MongoURL = process.env.MONGO_URL;

const app = express();
app.use(cors());
app.use(json());

// CRIAR UM ARQUIVO SEPARADO PARA CONECTAR COM O BANCO DE DADOS

let db = null;
const mongoClient = new MongoClient(MongoURL);
try {
    await mongoClient.connect();
    db = mongoClient.db(Database);
    console.log(chalk.bold.green("Banco de dados conectado, show!!"))
}
catch (e) {
    console.log(e);
    // res.status(500).send(chalk.red.bold("Falha na conexão com o banco"))
}

app.post("/cadastro", async (req, res) => {

    const cadastroSchema = joi.object({
        nome: joi.string().required(),
        email: joi.string().required(),
        senha: joi.string().required(),
        senha2: joi.string().required()
    })

    const { nome, senha, senha2 } = req.body;
    const usuario = req.body;
    const validação = cadastroSchema.validate(usuario);
    // Valida se os dados estão preenchidos corretamente
    if (validação.error) {
        return res.status(422).send("Todos os campos são obrigatórios");
    }
      // valida se as duas senhas são iguais
      if (senha !== senha2) {
        return res.status(422).send("A confirmação da senha está incorreta");
    }

    try {
        // valida se já existe um nome igual cadastrado
        const verificaUsuario = await db.collection("usuariosTeste").findOne({nome: nome})
        console.log(chalk.bold.red(verificaUsuario));
        if (verificaUsuario) {
          res.status(422).send("Nome de usuário já existente");
          return;
        }
        // Criptografia da senha
        const senhaHash = bcrypt.hashSync(senha,10);
        await db.collection("usuariosTeste").insertOne({...usuario, senha:senhaHash, senha2:""})
    }

    catch (error) {
        console.error(error);
        res.status(500).send(chalk.red.bold("Falha no cadastro de usuário novo"))
    }
    res.sendStatus(201);
})

app.post("/", async (req,res) => {
    const loginSchema = joi.object({
        login: joi.string().required(),
        senha: joi.string().required(),
    })
    const {login, senha} = req.body;
    const validação = loginSchema.validate(req.body)
    if (validação.error) return res.status(422).send("Todos os campos são obrigatórios");
    try {
       // comparação de senhas criptografadas 
      const user = await db.collection("usuariosTeste").findOne({nome: login})
      if (user && bcrypt.compareSync(senha, user.senha)) {
          console.log(chalk.bold.blue("Deu certo a comparação de senhas"))
          res.sendStatus(201);
      }
      else {
        return res.status(422).send("Senha incorreta");
      }
    }

    catch (error) {
        console.error(error);
        res.status(500).send(chalk.red.bold("Falha na execução do login"))
    }
    })

app.listen(Port, () => {
    console.log(chalk.bold.blue(`Servidor conectado na porta ${Port}`))
}) 