import express from "express";

import asyncError from "@/middlewares/asyncError.middleware";
import { Auth } from "@/middlewares/auth.middleware";
import { BelongsToHouse } from "@/middlewares/belongsToHouse.middleware";
import { HouseExist } from "@/middlewares/houseExists.middleware";
import { Owner } from "@/middlewares/owner.middleware";
import { SchemaValidator } from "@/middlewares/schemaValidator.middeware";
import { FIELD_TYPES } from "@/utils/constants";

import houseController from "../controllers/house.controller";
import { createHouseSchema, handleJoinSchema, updateHouseSchema } from "../utils/RouteSchemas/houseRouteSchemas";

const router = express.Router();

router.get("/list", Auth, asyncError(houseController.list)); //should be disabled
router.post("/create", [SchemaValidator(createHouseSchema), Auth], asyncError(houseController.create));
router.get("/:houseId", [Auth, HouseExist(FIELD_TYPES.PARAMS), BelongsToHouse], asyncError(houseController.getById));
router.put(
	"/update/:houseId",
	[SchemaValidator(updateHouseSchema), Auth, HouseExist(FIELD_TYPES.PARAMS), Owner],
	asyncError(houseController.update),
);
router.delete("/delete/:houseId", [Auth, HouseExist(FIELD_TYPES.PARAMS), Owner], asyncError(houseController.delete));
router.get("/join/:house_code", [Auth, HouseExist(FIELD_TYPES.PARAMS)], asyncError(houseController.join));
router.post(
	"/handleJoin/:houseId",
	[SchemaValidator(handleJoinSchema), Auth, HouseExist(FIELD_TYPES.PARAMS), Owner],
	asyncError(houseController.handleJoin),
);

export default router;
