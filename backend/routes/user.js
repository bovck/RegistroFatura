import express from "express";
import { postCadastro, postLogin } from "../controllers/user.js";

const router = express.Router();

router.post("/cadastro", postCadastro);

router.post("/login", postLogin);

export default router;
