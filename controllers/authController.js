import db from "./../db.js"
import chalk from "chalk";
import bcrypt from "bcrypt";
import {v4} from "uuid";

export async function postCadastro (req, res) {
        const { email, senha, senha2 } = req.body;
        const usuario = req.body;
          if (senha !== senha2) return res.status(401).send("A confirmação da senha está incorreta");
        try {
            const verificaUsuario = await db.collection("usuarios").findOne({email: email})
            if (verificaUsuario) return res.status(422).send("Email de usuário já existente");
            
            // Criptografia da senha
            const senhaHash = bcrypt.hashSync(senha,10);
            await db.collection("usuarios").insertOne({...usuario, senha:senhaHash, senha2:""})
        }
        catch (error) {
            console.error(error);
            res.status(500).send(chalk.red.bold("Falha no cadastro de usuário novo"))
        }
        res.sendStatus(201);
}

export async function postLogin (req,res) {
    const {login, senha} = req.body;
    try {
       // comparação de senhas criptografadas
      const user = await db.collection("usuarios").findOne({email: login});
      if (!user) return res.status(422).send("Usuário inexistente");
      if (user && bcrypt.compareSync(senha, user.senha)) {
          // Criação do token
          const token = v4();
          await db.collection("sessions").insertOne({
              userId: user._id,
              token
          })
          const data = {
              usuario: user.nome,
              token,
              id: user._id
          }
          res.send(data).status(200);
      }
      else return res.status(422).send("Senha incorreta");
    }
    catch (error) {
        console.error(error);
        res.status(500).send(chalk.red.bold("Falha na execução do login"))
    }
}