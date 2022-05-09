import db from "./../db.js"
import chalk from "chalk";
import joi from "joi";
import bcrypt from "bcrypt";
import {v4} from "uuid";

export async function postCadastro (req, res) {
        const cadastroSchema = joi.object({
            nome: joi.string().required(),
            email: joi.string().required(),
            senha: joi.string().required(),
            senha2: joi.string().required()
        })
    
        const { email, senha, senha2 } = req.body;
        const usuario = req.body;
        const validação = cadastroSchema.validate(usuario);
        // Valida se os dados estão preenchidos corretamente
        if (validação.error) {
            return res.status(422).send("Todos os campos são obrigatórios");
        }
          // valida se as duas senhas são iguais
          if (senha !== senha2) {
            return res.status(422).send("A confirmação da senha está incorreta");
        }

        try {
            // valida se já existe um nome igual cadastrado
            const verificaUsuario = await db.collection("usuariosTeste").findOne({email: email})
            console.log(chalk.bold.red(verificaUsuario));
            if (verificaUsuario) {
              res.status(422).send("Email de usuário já existente");
              return;
            }
            // Criptografia da senha
            const senhaHash = bcrypt.hashSync(senha,10);
            await db.collection("usuariosTeste").insertOne({...usuario, senha:senhaHash, senha2:""})
        }
    
        catch (error) {
            console.error(error);
            res.status(500).send(chalk.red.bold("Falha no cadastro de usuário novo"))
        }
        res.sendStatus(201);
}


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
      const user = await db.collection("usuariosTeste").findOne({email: login});
      if (!user) return res.status(422).send("Usuário inexistente");
      if (user && bcrypt.compareSync(senha, user.senha)) {
          console.log(chalk.bold.green("Deu certo a comparação de senhas"));
          // Criação do token
          const token = v4();
          console.log("token: ", token);
          await db.collection("sessions").insertOne({
              userId: user._id,
              token
          })
          const data = {
              usuario: user.nome,
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