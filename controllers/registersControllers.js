import db from "./../db.js"
import chalk from "chalk";
import joi from "joi";
import dayjs from "dayjs";

export async function getRegistros(req, res) {
    const {user} = res.locals
    try {
        const registro = await db.collection("registros").find({ usuario: user.nome }).toArray();
        return res.send(registro).status(201);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(chalk.red.bold("Falha no cadastro de usuário novo"))
    }
}

export async function postEntradas(req, res) {
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
