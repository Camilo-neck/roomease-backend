import express from "express";

import asyncError from "@/middlewares/asyncError.middleware";
import { SchemaValidator } from "@/middlewares/schemaValidator.middeware";

import authController from "../controllers/auth.controller";
import { loginSchema, registerSchema } from "../utils/RouteSchemas/authRouteSchemas";

const router = express.Router();

router.post("/register", SchemaValidator(registerSchema), asyncError(authController.register));
router.post("/login", SchemaValidator(loginSchema), asyncError(authController.login));

export default router;
