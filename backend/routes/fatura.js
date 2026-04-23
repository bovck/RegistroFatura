import express from "express";
import { postFatura } from "../controllers/fatura.js";

const router = express.Router();

router.post("/index", postFatura);

export default router;
