import express from "express";

import { TokenValidation } from "@/middlewares/verifyToken";

import authController from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.get("/profile", TokenValidation, authController.profile);

export default router;
