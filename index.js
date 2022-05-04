import express, {json} from "express";
import { MongoClient, ObjectId } from "mongodb";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const Port = process.env.PORT;
const MongoURL = process.env.MONGO_URL;

const app = express();
app.use(cors());
app.use(json());

let db = null;
const mongoClient = new MongoClient(MongoURL);
try {
    await mongoClient.connect();
    db = mongoClient.db("test");
    console.log(chalk.bold.green("Banco de dados conectado, show!!"))
}
catch (e) {
    console.log(e);
    // res.status(500).send(chalk.red.bold("Falha na conexão com o banco"))
}

app.listen(Port, () => {
    console.log(chalk.bold.blue(`Servidor conectado na porta ${Port}`))
}) 