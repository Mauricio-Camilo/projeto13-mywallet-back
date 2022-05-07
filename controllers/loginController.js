import db from "./../db.js"
import chalk from "chalk";
import joi from "joi";
import bcrypt from "bcrypt";
import {v4} from "uuid";

export async function postLogin (req,res) {
    const loginSchema = joi.object({
        login: joi.string().required(),
        senha: joi.string().required(),
    })
    const {login, senha} = req.body;
    const validação = loginSchema.validate(req.body)
    if (validação.error) return res.status(422).send("Todos os campos são obrigatórios");
    try {
       // comparação de senhas criptografadas 
      const user = await db.collection("usuariosTeste").findOne({nome: login});
      if (!user) return res.status(422).send("Usuário inexistente");
      if (user && bcrypt.compareSync(senha, user.senha)) {
          console.log(chalk.bold.blue("Deu certo a comparação de senhas"));

          // Criação do token
          const token = v4();
          console.log("token: ", token);
          await db.collection("sessions").insertOne({
              userId: user._id,
              token
          })
          const data = {
              usuario: login,
              token,
              id: user._id
          }
          res.send(data).status(201);
      }
      else {
        return res.status(422).send("Senha incorreta");
      }
    }

    catch (error) {
        console.error(error);
        res.status(500).send(chalk.red.bold("Falha na execução do login"))
    }
}