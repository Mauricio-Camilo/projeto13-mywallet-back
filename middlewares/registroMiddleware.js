import chalk from "chalk";
import joi from "joi";

export async function validarRegistro (req, res, next) {
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