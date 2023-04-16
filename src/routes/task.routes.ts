import express from "express";

import { Auth } from "@/middlewares/auth.middleware";
import { BelongsToHouse } from "@/middlewares/belongsToHouse.middleware";
import { HouseExist } from "@/middlewares/houseExists.middleware";
import { SchemaValidator } from "@/middlewares/schemaValidator.middeware";
import { TASK_ROUTES } from "@/utils/constants";

import taskController from "../controllers/task.controller";

const router = express.Router();

router.get(
	TASK_ROUTES.GET_BY_HOUSE,
	[Auth, HouseExist, BelongsToHouse],
	taskController.getByHouse,
);
router.get(TASK_ROUTES.GET_BY_USER, Auth, taskController.getByUser);
router.post(
	TASK_ROUTES.CREATE,
	[SchemaValidator, Auth, HouseExist, BelongsToHouse],
	taskController.create,
);
router.post(TASK_ROUTES.UPDATE, Auth, taskController.update);
router.post(TASK_ROUTES.DELETE, Auth, taskController.delete);
router.post(TASK_ROUTES.DONE, Auth, taskController.done);

router.get(TASK_ROUTES.LIST, Auth, taskController.list);

export default router;
