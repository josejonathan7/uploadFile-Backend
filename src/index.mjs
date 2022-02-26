import dotenv from "dotenv";
import express from "express";
import route from "./routes.mjs";
import morgan from "morgan";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();

mongoose.connect(process.env.MONGO_URL, {
	useNewUrlParser: true
});

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(morgan("dev"));
server.use("/files", express.static(path.resolve(__dirname, "..", "tmp", "uploads")));

server.use(route);


server.listen(3000, () => console.log("O servidor esta rodando"));
