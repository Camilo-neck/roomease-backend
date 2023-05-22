import express from "express";

import userController from "../controllers/user.controller";
import asyncError from "../middlewares/asyncError.middleware";
import { Auth } from "../middlewares/auth.middleware";
import { SchemaValidator } from "../middlewares/schemaValidator.middeware";
import { FIELD_TYPES } from "../utils/constants";
import { paramsSchema, updateUserSchema } from "../utils/RouteSchemas/userRouteSchemas";

const router = express.Router();

router.get("/", Auth, asyncError(userController.listUsers)); //should be disabled
router.get("/profile", Auth, asyncError(userController.profile));
router.get("/houses", Auth, asyncError(userController.getHouses));
router.get("/:id", Auth, SchemaValidator(paramsSchema, FIELD_TYPES.PARAMS), asyncError(userController.getUserInfo));
router.put(
	"/:id",
	Auth,
	SchemaValidator(paramsSchema, FIELD_TYPES.PARAMS),
	SchemaValidator(updateUserSchema, FIELD_TYPES.BODY),

	asyncError(userController.updateUser),
);
router.delete("/:id", Auth, SchemaValidator(paramsSchema, FIELD_TYPES.PARAMS), asyncError(userController.deleteUser));

export default router;

//hola
