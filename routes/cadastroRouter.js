import express from "express";
import { Router } from 'express';
import { postCadastro } from './../controllers/cadastroController.js';
import {postLogin} from "./../controllers/loginController.js"

const cadastroRouter = express.Router();

cadastroRouter.post("/cadastro", postCadastro);
cadastroRouter.post("/", postLogin);

export default cadastroRouter;

