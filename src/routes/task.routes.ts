import express from "express";

import taskController from "@/controllers/task.controller";
import { Auth } from "@/middlewares/auth.middleware";
import { BelongsToHouse } from "@/middlewares/belongsToHouse.middleware";
import { HouseExist } from "@/middlewares/houseExists.middleware";
import { SchemaValidator } from "@/middlewares/schemaValidator.middeware";
import { createTaskSchema } from "@/utils/RouteSchemas/taskRouteSchemas";

const router = express.Router();

router.get(
	"/getByHouse",
	[Auth, HouseExist, BelongsToHouse],
	taskController.getByHouse,
);
router.get("/getByUser", Auth, taskController.getByUser);
router.post(
	"/create",
	[SchemaValidator(createTaskSchema), Auth, HouseExist, BelongsToHouse],
	taskController.create,
);
router.post("/update", Auth, taskController.update);
router.post("/delete", Auth, taskController.delete);
router.post("/done", Auth, taskController.done);

router.get("/list", Auth, taskController.list);

export default router;
