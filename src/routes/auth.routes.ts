import express from "express";

import { Auth } from "@/middlewares/auth.middleware";
import { SchemaValidator } from "@/middlewares/schemaValidator.middeware";

import authController from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", SchemaValidator, authController.register);
router.post("/login", SchemaValidator, authController.login);

export default router;
