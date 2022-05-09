import express from "express";
import { validarCadastro, validarLogin } from "../middlewares/validacoesMiddleware.js";
import { postCadastro, postLogin  } from "../controllers/authController.js"

const authRouter = express.Router();

authRouter.post("/cadastro", validarCadastro, postCadastro);
authRouter.post("/",validarLogin, postLogin);

export default authRouter;


