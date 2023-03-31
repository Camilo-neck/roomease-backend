import express from "express";

import { Auth } from "@/middlewares/auth.middleware";
import { BelongsToHouse } from "@/middlewares/belongsToHouse.middleware";
import { HouseExist } from "@/middlewares/houseExists.middleware";
import { Owner } from "@/middlewares/owner.middleware";
import { SchemaValidator } from "@/middlewares/schemaValidator.middeware";
import { HOUSE_ROUTES } from "@/utils/constants";

import houseController from "../controllers/house.controller";

const router = express.Router();

router.get(HOUSE_ROUTES.LIST, Auth, houseController.list); //should be disabled
router.post(
	HOUSE_ROUTES.CREATE,
	[SchemaValidator, Auth],
	houseController.create,
);
router.get(
	"/:houseId",
	[Auth, HouseExist, BelongsToHouse],
	houseController.getById,
);
router.put(
	`${HOUSE_ROUTES.UPDATE}/:houseId`,
	[SchemaValidator, Auth, HouseExist, Owner],
	houseController.update,
);
router.delete(
	`${HOUSE_ROUTES.DELETE}/:houseId`,
	[Auth, HouseExist, Owner],
	houseController.delete,
);
router.get(
	`${HOUSE_ROUTES.JOIN}/:house_code`,
	[Auth, HouseExist],
	houseController.join,
);
router.post(
	`${HOUSE_ROUTES.HANDLE_JOIN}/:houseId`,
	[SchemaValidator, Auth, HouseExist, Owner],
	houseController.handleJoin,
);

export default router;
