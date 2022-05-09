import express from "express";
import {validarToken} from "./../middlewares/authMiddlewares.js"
import { validarRegistro } from "../middlewares/validacoesMiddleware.js";
import { getRegistros, postRegistro } from "../controllers/registersControllers.js";

const registersRouter = express.Router();

registersRouter.use(validarToken);

registersRouter.get("/registros", getRegistros);
registersRouter.post("/entrada", validarRegistro, postRegistro);
registersRouter.post("/saida", validarRegistro, postRegistro);

export default registersRouter;