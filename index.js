import express, { json } from "express";
import { MongoClient, ObjectId } from "mongodb";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";
import joi from "joi";
import bcrypt from "bcrypt";
import {v4} from "uuid";
import db from "./db.js";
import cadastroRouter from "./routes/cadastroRouter.js";
// import {postCadastro} from "./controllers/cadastroController.js"
// import {postLogin} from "./controllers/loginController.js"

dotenv.config();

const Port = process.env.PORT;

const app = express();
app.use(json());
app.use(cadastroRouter);
app.use(cors());

// app.post("/cadastro", postCadastro);
// app.post("/", postLogin);

app.listen(Port, () => {
    console.log(chalk.bold.blue(`Servidor conectado na porta ${Port}`))
}) 


