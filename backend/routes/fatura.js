import express from "express";
import {
  deleteFatura,
  getFatura,
  postFatura,
  putFatura,
} from "../controllers/fatura.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.get("/index", isAuth, getFatura);

router.post("/index", isAuth, postFatura);

router.put("/index/:faturaId", isAuth, putFatura);

router.delete("/index/:faturaId", isAuth, deleteFatura);

export default router;
