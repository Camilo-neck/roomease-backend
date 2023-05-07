import express from "express";

import taskController from "@/controllers/task.controller";
import { Auth } from "@/middlewares/auth.middleware";
import { BelongsToHouse } from "@/middlewares/belongsToHouse.middleware";
import { HouseExist } from "@/middlewares/houseExists.middleware";
import { ParamsValidator } from "@/middlewares/paramsValidator.middleware";
import { QueryValidator } from "@/middlewares/queryValidator.middleware";
import { SchemaValidator } from "@/middlewares/schemaValidator.middeware";
import { createTaskSchema, paramsSchema, querySchema,updateTaskSchema } from "@/utils/RouteSchemas/taskRouteSchemas";

import asyncError from "../middlewares/asyncError.middleware";
import { FIELD_TYPES } from "../utils/constants";

const router = express.Router();

router.get("/", [Auth, QueryValidator(querySchema), HouseExist(FIELD_TYPES.QUERY), BelongsToHouse], asyncError(taskController.get));
router.post(
	"/",
	[SchemaValidator(createTaskSchema), Auth, HouseExist(FIELD_TYPES.BODY), BelongsToHouse],
	asyncError(taskController.create),
);
router.put("/:id", [Auth, ParamsValidator(paramsSchema) ,SchemaValidator(updateTaskSchema)], asyncError(taskController.update));
router.delete("/:id", [Auth, ParamsValidator(paramsSchema)] ,asyncError(taskController.delete));
router.put("/done/:id", [Auth, ParamsValidator(paramsSchema)] ,asyncError(taskController.done));

router.get("/list", Auth, asyncError(taskController.list));

export default router;
