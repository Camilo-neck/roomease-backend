import express from "express";

import asyncError from "@/middlewares/asyncError.middleware";
import { SchemaValidator } from "@/middlewares/schemaValidator.middeware";

import authController from "../controllers/auth.controller";
import { loginSchema, registerSchema } from "../utils/RouteSchemas/authRouteSchemas";

const router = express.Router();

<<<<<<< HEAD
router.post(
	"/register",
	SchemaValidator(registerSchema),
	authController.register,
);
router.post("/login", SchemaValidator(loginSchema), authController.login);
=======
router.post("/register", SchemaValidator(registerSchema), asyncError(authController.register));
router.post("/login", SchemaValidator(loginSchema), asyncError(authController.login));
>>>>>>> 2c0d77f8f921d20153848164a63a114384bff923

export default router;
