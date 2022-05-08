import express, { json } from "express";
import { MongoClient, ObjectId } from "mongodb";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";
import joi from "joi";
import cadastroRouter from "./routes/cadastroRouter.js";
import db from "./db.js";
import dayjs from "dayjs";

// import {postCadastro} from "./controllers/cadastroController.js"
// import {postLogin} from "./controllers/loginController.js"

// MUDAR O NOME DE cadastroRouter para authRouter
// NO CONTROLLERS, CRIAR UM ARQUIVO SÓ CHAMADO authController
// DENTRO DESSE ARQUIVO, COLOCAR AS DUAS FUNÇÕES DENTRO DELE

dotenv.config();

const Port = process.env.PORT;

const app = express();
app.use(json());
app.use(cors());
app.use(cadastroRouter);

// app.post("/cadastro", postCadastro);
// app.post("/", postLogin);

app.get("/registros", async (req, res) => {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer', '').trim();
    // 1a validação: Verifica se o token é válido 
    if (!token) return res.send("Token inexistente").status(401);
    try {
    // 2a validação: Verifica se o token existe na coleção dos tokens 
        const session = await db.collection("sessions").findOne({token})
        if (!session) return res.sendStatus(401); 
    // 3a validação: Busca os dados do usuário associado ao token na coleção de informações 
        const user = await db.collection("usuariosTeste").findOne({_id: session.userId});
        if (user) {
            const registro = await db.collection("registros").find({usuario: user.nome}).toArray();
            console.log(chalk.bold.blue(registro));
            return res.send(registro).status(201);
        } 
        else res.sendStatus(401); 
    }
    catch (error) {
        console.error(error);
        res.status(500).send(chalk.red.bold("Falha no cadastro de usuário novo"))
    }
});

app.post("/entrada", async(req,res) => {
    console.log(req.body);
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer', '').trim();
    // 1a validação: Verifica se o token é válido 
    if (!token) return res.send("Token inexistente").status(401);
    else console.log("Passou na primeira validação")
    try {
    // 2a validação: Verifica se o token existe na coleção dos tokens 
        const session = await db.collection("sessions").findOne({token})
        if (!session) return res.sendStatus(401); 
        else console.log("Passou na segunda validação")

    // Validação de joi
        const entradaSchema = joi.object({
            usuario: joi.string().required(),
            valor: joi.number().required(),
            descricao: joi.string().required(),
            status: joi.string().required()
        })

        const validação = entradaSchema.validate(req.body);
        if (validação.error) {
            console.log(chalk.bold.red(validação.error));
            return res.status(422).send("Todos os campos são obrigatórios");
        }
        else console.log("Passou na validação do joi");


    const {usuario, valor, descricao, status} = req.body;
    const registro = {
        usuario,
        data: dayjs().format('DD/MM'),
        valor,
        descricao,
        status,
    }
        await db.collection("registros").insertOne(registro);
        res.send("Entrada salva com sucesso").status(201);
}
    catch (error) {
        console.error(error);
        res.status(500).send(chalk.red.bold("Falha no cadastro de uma entrada"))
    }
})

app.post("/saida", async(req,res) => {
    console.log(req.body);
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer', '').trim();
    // 1a validação: Verifica se o token é válido 
    if (!token) return res.send("Token inexistente").status(401);
    else console.log("Passou na primeira validação")
    try {
    // 2a validação: Verifica se o token existe na coleção dos tokens 
        const session = await db.collection("sessions").findOne({token})
        if (!session) return res.sendStatus(401); 
        else console.log("Passou na segunda validação")

    // Validação de joi
        const saidaSchema = joi.object({
            usuario: joi.string().required(),
            valor: joi.number().required(),
            descricao: joi.string().required(),
            status: joi.string().required()
        })

        const validação = saidaSchema.validate(req.body);
        if (validação.error) {
            console.log(chalk.bold.red(validação.error));
            return res.status(422).send("Todos os campos são obrigatórios");
        }
        else console.log("Passou na validação do joi");


    const {usuario, valor, descricao, status} = req.body;
    const registro = {
        usuario,
        data: dayjs().format('DD/MM'),
        valor,
        descricao,
        status,
    }
        await db.collection("registros").insertOne(registro);
        res.send("Saida salva com sucesso").status(201);
}
    catch (error) {
        console.error(error);
        res.status(500).send(chalk.red.bold("Falha no cadastro de uma saida"))
    }
})

app.listen(Port, () => {
    console.log(chalk.bold.blue(`Servidor conectado na porta ${Port}`))
}) 





