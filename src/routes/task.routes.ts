import express from "express";

import taskController from "../controllers/task.controller";
import asyncError from "../middlewares/asyncError.middleware";
import { Auth } from "../middlewares/auth.middleware";
import { BelongsToHouse } from "../middlewares/belongsToHouse.middleware";
import { HouseExist } from "../middlewares/houseExists.middleware";
import { SchemaValidator } from "../middlewares/schemaValidator.middeware";
import { FIELD_TYPES } from "../utils/constants";
import { createTaskSchema, paramsSchema, querySchema, updateTaskSchema } from "../utils/RouteSchemas/taskRouteSchemas";

const router = express.Router();

router.get(
	"/",
	[Auth, SchemaValidator(querySchema, FIELD_TYPES.QUERY), HouseExist(FIELD_TYPES.QUERY), BelongsToHouse],
	asyncError(taskController.get),
);
router.post(
	"/",
	[SchemaValidator(createTaskSchema, FIELD_TYPES.BODY), Auth, HouseExist(FIELD_TYPES.BODY), BelongsToHouse],
	asyncError(taskController.create),
);
router.put(
	"/:id",
	[Auth, SchemaValidator(paramsSchema, FIELD_TYPES.PARAMS), SchemaValidator(updateTaskSchema, FIELD_TYPES.BODY)],
	asyncError(taskController.update),
);
router.delete("/:id", [Auth, SchemaValidator(paramsSchema, FIELD_TYPES.PARAMS)], asyncError(taskController.delete));
router.put("/done/:id", [Auth, SchemaValidator(paramsSchema, FIELD_TYPES.PARAMS)], asyncError(taskController.done));

router.get("/list", Auth, asyncError(taskController.list));

export default router;
