import express from "express";

import taskController from "@/controllers/task.controller";
import { Auth } from "@/middlewares/auth.middleware";
import { BelongsToHouse } from "@/middlewares/belongsToHouse.middleware";
import { HouseExist } from "@/middlewares/houseExists.middleware";
import { SchemaValidator } from "@/middlewares/schemaValidator.middeware";
import { createTaskSchema } from "@/utils/RouteSchemas/taskRouteSchemas";

import asyncError from "../middlewares/asyncError.middleware";

const router = express.Router();

router.get("/get", [Auth, HouseExist, BelongsToHouse], asyncError(taskController.get));
router.post(
	"/create",
	[SchemaValidator(createTaskSchema), Auth, HouseExist, BelongsToHouse],
	asyncError(taskController.create),
);
router.post("/update", Auth, asyncError(taskController.update));
router.delete("/delete/:id", Auth, asyncError(taskController.delete));
router.post("/done/:id", Auth, asyncError(taskController.done));

router.get("/list", Auth, asyncError(taskController.list));

export default router;
