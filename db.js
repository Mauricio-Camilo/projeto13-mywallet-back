import { MongoClient, ObjectId } from "mongodb";
import chalk from "chalk";

import dotenv from "dotenv";
dotenv.config();

const Database = process.env.DATABASE;
const MongoURL = process.env.MONGO_URL;

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
export default db;

