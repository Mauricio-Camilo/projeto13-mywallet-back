import express from "express";
import { getRegistros, postEntradas, postSaidas } from "../controllers/registersControllers.js";

const registersRouter = express.Router();
registersRouter.get("/registros", getRegistros);
registersRouter.post("/entrada", postEntradas);
registersRouter.post("/saida", postSaidas);

export default registersRouter;