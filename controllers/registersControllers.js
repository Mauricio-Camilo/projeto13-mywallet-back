import db from "./../db.js"
import chalk from "chalk";
import dayjs from "dayjs";

export async function getRegistros(req, res) {
    const { user } = res.locals
    try {
        const registro = await db.collection("registros").find({ usuario: user.nome }).toArray();
        return res.send(registro).status(200);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(chalk.red.bold("Falha no cadastro de usuário novo"))
    }
}

export async function postRegistro(req, res) {
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
        res.send("Registro salva com sucesso").status(201);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(chalk.red.bold("Falha no cadastro de um registro"))
    }
}
