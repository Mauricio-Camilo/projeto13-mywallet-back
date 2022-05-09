import express, { json } from "express";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js";
import registersRouter from "./routes/registersRouter.js";

dotenv.config();

const Port = process.env.PORT;

const app = express();
app.use(json());
app.use(cors());
app.use(authRouter);
app.use(registersRouter);

app.listen(Port, () => {
    console.log(chalk.bold.blue(`Servidor conectado na porta ${Port}`))
}) 





