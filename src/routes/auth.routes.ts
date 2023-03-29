import express from "express";

import { SchemaValidator } from "@/middlewares/schemaValidator.middeware";
import { AUTH_ROUTES } from "@/utils/constants";

import authController from "../controllers/auth.controller";

const router = express.Router();

router.post(AUTH_ROUTES.REGISTER, SchemaValidator, authController.register);
router.post(AUTH_ROUTES.LOGIN, SchemaValidator, authController.login);

export default router;
