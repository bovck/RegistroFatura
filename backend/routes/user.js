import express from "express";
import { postCadastro } from "../controllers/user.js";

const router = express.Router();

router.post("/cadastro", postCadastro);

export default router;
