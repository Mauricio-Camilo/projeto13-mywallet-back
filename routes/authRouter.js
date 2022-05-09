import express from "express";
import { postCadastro, postLogin  } from "../controllers/authController.js"

const authRouter = express.Router();

authRouter.post("/cadastro", postCadastro);
authRouter.post("/", postLogin);

export default authRouter;


