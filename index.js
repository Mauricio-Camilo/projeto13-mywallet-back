import express, { json } from "express";
import { MongoClient, ObjectId } from "mongodb";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";
// import db from "./db.js";
import cadastroRouter from "./routes/cadastroRouter.js";
import db from "./db.js";
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
        console.log(chalk.bold.blue(user));
        if (user) {
            console.log("Passou na terceira validação");
            delete user.senha; 
            delete user.senha2;
            return res.send(user).status(201);;
        } 
        else res.sendStatus(401); 
    }
    catch (error) {
        console.error(error);
        res.status(500).send(chalk.red.bold("Falha no cadastro de usuário novo"))
    }
});

app.post("/entrada", async(req,res) => {
    
})

app.listen(Port, () => {
    console.log(chalk.bold.blue(`Servidor conectado na porta ${Port}`))
}) 





