import express from "express";
import { postFatura, getFatura } from "../controllers/fatura.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.get("/index", isAuth, getFatura);

router.post("/index", isAuth, postFatura);

export default router;
