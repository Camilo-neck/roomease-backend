import express from "express";

import authController from "../controllers/auth.controller";
import asyncError from "../middlewares/asyncError.middleware";
import { SchemaValidator } from "../middlewares/schemaValidator.middeware";
import { FIELD_TYPES } from "../utils/constants";
import { loginSchema, registerSchema } from "../utils/RouteSchemas/authRouteSchemas";

const router = express.Router();

router.post("/register", SchemaValidator(registerSchema, FIELD_TYPES.BODY), asyncError(authController.register));
router.post("/login", SchemaValidator(loginSchema, FIELD_TYPES.BODY), asyncError(authController.login));
router.post("/refreshToken", asyncError(authController.refreshToken));

export default router;
