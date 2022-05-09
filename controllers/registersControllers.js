import db from "./../db.js"
import chalk from "chalk";
import joi from "joi";
import dayjs from "dayjs";

export async function getRegistros (req, res) {
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
}

export async function postEntradas (req, res) {
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
}

export async function postSaidas (req, res) {
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
}
