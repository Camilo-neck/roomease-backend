import express from "express";

import asyncError from "@/middlewares/asyncError.middleware";
import { Auth } from "@/middlewares/auth.middleware";
import { ParamsValidator } from "@/middlewares/paramsValidator.middleware";
import { SchemaValidator } from "@/middlewares/schemaValidator.middeware";
import { paramsSchema, updateUserSchema } from "@/utils/RouteSchemas/userRouteSchemas";

import userController from "../controllers/user.controller";

const router = express.Router();

router.get("/", Auth, asyncError(userController.listUsers)); //should be disabled
router.get("/profile", Auth, asyncError(userController.profile));
router.get("/houses", Auth, asyncError(userController.getHouses));
router.get("/:id", Auth, ParamsValidator(paramsSchema), asyncError(userController.getUserInfo));
router.put(
	"/:id",
	Auth,
	ParamsValidator(paramsSchema),
	SchemaValidator(updateUserSchema),

	asyncError(userController.updateUser),
);
router.delete("/:id", Auth, ParamsValidator(paramsSchema), asyncError(userController.deleteUser));

export default router;
