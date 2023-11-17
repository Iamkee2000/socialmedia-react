import express from "express";
import { login } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login); //When a POST request is made to this path, it will trigger the login function. This route is typically used for user login authentication.

export default router;