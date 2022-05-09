import express from "express";
import {validarToken} from "./../middlewares/authMiddlewares.js"
import { validarRegistro } from "../middlewares/registroMiddleware.js";
import { getRegistros, postEntradas, postSaidas } from "../controllers/registersControllers.js";

const registersRouter = express.Router();

registersRouter.use(validarToken);

registersRouter.get("/registros", getRegistros);
registersRouter.post("/entrada", validarRegistro, postEntradas);
registersRouter.post("/saida", postSaidas);

export default registersRouter;