import express from "express";
import { postFatura, getFatura } from "../controllers/fatura.js";

const router = express.Router();

router.get("/index", getFatura);

router.post("/index", postFatura);

export default router;
