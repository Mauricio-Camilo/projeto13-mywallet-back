import db from "./../db.js"
import chalk from "chalk";
import joi from "joi";
import dayjs from "dayjs";

export async function getRegistros(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer', '').trim();

    try {
        const session = await db.collection("sessions").findOne({ token })
        const user = await db.collection("usuariosTeste").findOne({ _id: session.userId });
        const registro = await db.collection("registros").find({ usuario: user.nome }).toArray();
        return res.send(registro).status(201);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(chalk.red.bold("Falha no cadastro de usuário novo"))
    }
}

export async function postEntradas(req, res) {
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


        const { usuario, valor, descricao, status } = req.body;
        const registro = {
            usuario,
            data: dayjs().format('DD/MM'),
            valor,
            descricao,
            status,
        }
    try {
        await db.collection("registros").insertOne(registro);
        res.send("Entrada salva com sucesso").status(201);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(chalk.red.bold("Falha no cadastro de uma entrada"))
    }
}

export async function postSaidas(req, res) {

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

        const { usuario, valor, descricao, status } = req.body;
        const registro = {
            usuario,
            data: dayjs().format('DD/MM'),
            valor,
            descricao,
            status,
        }
    try {
        await db.collection("registros").insertOne(registro);
        res.send("Saida salva com sucesso").status(201);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(chalk.red.bold("Falha no cadastro de uma saida"))
    }
}
