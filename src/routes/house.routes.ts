import express from "express";

import asyncError from "@/middlewares/asyncError.middleware";
import { Auth } from "@/middlewares/auth.middleware";
import { BelongsToHouse } from "@/middlewares/belongsToHouse.middleware";
import { HouseExist } from "@/middlewares/houseExists.middleware";
import { Owner } from "@/middlewares/owner.middleware";
import { ParamsValidator } from "@/middlewares/paramsValidator.middleware";
import { SchemaValidator } from "@/middlewares/schemaValidator.middeware";
import { FIELD_TYPES } from "@/utils/constants";

import houseController from "../controllers/house.controller";
import { createHouseSchema, handleJoinSchema, paramsHouseCode,paramsSchema,updateHouseSchema } from "../utils/RouteSchemas/houseRouteSchemas";

const router = express.Router();

router.get("/", Auth, asyncError(houseController.list)); //should be disabled
router.post("/", [SchemaValidator(createHouseSchema), Auth], asyncError(houseController.create));
router.get("/:houseId", [Auth, ParamsValidator(paramsSchema),HouseExist(FIELD_TYPES.PARAMS), BelongsToHouse], asyncError(houseController.getById));
router.put(
	"/:houseId",
	[ParamsValidator(paramsSchema),SchemaValidator(updateHouseSchema), Auth, HouseExist(FIELD_TYPES.PARAMS), Owner],
	asyncError(houseController.update),
);
router.delete("/:houseId", [Auth, ParamsValidator(paramsSchema), HouseExist(FIELD_TYPES.PARAMS), Owner], asyncError(houseController.delete));
router.put("/join/:house_code", [Auth, ParamsValidator(paramsHouseCode), HouseExist(FIELD_TYPES.PARAMS)], asyncError(houseController.join));
router.put(
	"/handleJoin/:houseId",
	[ParamsValidator(paramsSchema), SchemaValidator(handleJoinSchema), Auth, HouseExist(FIELD_TYPES.PARAMS), Owner],
	asyncError(houseController.handleJoin),
);

export default router;
