import express, { json } from "express";
import { MongoClient, ObjectId } from "mongodb";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";

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
    const { nome, email, senha, confirmação } = req.body;
    console.log(nome, email, senha, confirmação);
    res.sendStatus(201);
}
)

app.listen(Port, () => {
    console.log(chalk.bold.blue(`Servidor conectado na porta ${Port}`))
}) 