import express, { json } from "express";
import { MongoClient, ObjectId } from "mongodb";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";
import joi from "joi";

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
    console.log(validação);
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
        if (verificaUsuario) return res.status(422).send("Nome de usuário já existente");
        await db.collection("usuariosTeste").insertOne(usuario); 
    }
    catch (error) {
        console.error(error);
        res.status(500).send(chalk.red.bold("Falha no cadastro de usuário novo"))
    }
    res.sendStatus(201);
}
)

app.listen(Port, () => {
    console.log(chalk.bold.blue(`Servidor conectado na porta ${Port}`))
}) 