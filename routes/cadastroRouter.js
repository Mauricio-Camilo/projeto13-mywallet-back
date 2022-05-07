import express from "express";
// import { Router } from 'express';  // COLOCAR NA LINHA DE CIMA OU DELETAR
import { postCadastro } from './../controllers/cadastroController.js';
import {postLogin} from "./../controllers/loginController.js"

const cadastroRouter = express.Router();

cadastroRouter.post("/cadastro", postCadastro);
cadastroRouter.post("/", postLogin);

export default cadastroRouter;

// Trocar o nme de cadastroRouter para authRouter

