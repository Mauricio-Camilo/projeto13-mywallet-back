import chalk from "chalk";
import joi from "joi";

export async function validarCadastro(req, res, next) {
    const cadastroSchema = joi.object({
        nome: joi.string().required(),
        email: joi.string().email().required(),
        senha: joi.string().required(),
        senha2: joi.string().required()
    })
    const usuario = req.body;
    const validação = cadastroSchema.validate(usuario);
    if (validação.error) {
        console.log(chalk.bold.red(validação.error));
        return res.status(422).send("Todos os campos são obrigatórios");
    }
    next();
}

export async function validarLogin(req, res, next) {
    const loginSchema = joi.object({
        login: joi.string().required(),
        senha: joi.string().required(),
    })
    const validação = loginSchema.validate(req.body)
    if (validação.error) {
        console.log(chalk.bold.red(validação.error));
        return res.status(422).send("Todos os campos são obrigatórios");
    }
    next()
}

export async function validarRegistro(req, res, next) {
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
    next();
}