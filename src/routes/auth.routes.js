import express from "express";
import { getWeather, login, register } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getWeather", getWeather);

export default router;