import express from "express";

import asyncError from "@/middlewares/asyncError.middleware";
import { Auth } from "@/middlewares/auth.middleware";
import { BelongsToHouse } from "@/middlewares/belongsToHouse.middleware";
import { HouseExist } from "@/middlewares/houseExists.middleware";
import { Owner } from "@/middlewares/owner.middleware";
import { SchemaValidator } from "@/middlewares/schemaValidator.middeware";
import { FIELD_TYPES } from "@/utils/constants";

import houseController from "../controllers/house.controller";
import {
	createHouseSchema,
	handleJoinSchema,
	kickUserSchema,
	leaveSchema,
	paramsHouseCode,
	paramsSchema,
	updateHouseSchema,
} from "../utils/RouteSchemas/houseRouteSchemas";

const router = express.Router();

router.get("/", Auth, asyncError(houseController.list)); //should be disabled
router.post("/", [SchemaValidator(createHouseSchema, FIELD_TYPES.BODY), Auth], asyncError(houseController.create));
router.put(
	"/join/:house_code",
	[Auth, SchemaValidator(paramsHouseCode, FIELD_TYPES.PARAMS), HouseExist(FIELD_TYPES.PARAMS)],
	asyncError(houseController.join),
);
router.put(
	"/handleJoin/:houseId",
	[
		SchemaValidator(paramsSchema, FIELD_TYPES.PARAMS),
		SchemaValidator(handleJoinSchema, FIELD_TYPES.BODY),
		Auth,
		HouseExist(FIELD_TYPES.PARAMS),
		Owner,
	],
	asyncError(houseController.handleJoin),
);
router.put(
	"/leave/:houseId",
	[Auth, SchemaValidator(leaveSchema, FIELD_TYPES.PARAMS), HouseExist(FIELD_TYPES.PARAMS), BelongsToHouse],
	asyncError(houseController.leaveHouse),
);
router.put(
	"/kick/",
	[Auth, SchemaValidator(kickUserSchema, FIELD_TYPES.QUERY), HouseExist(FIELD_TYPES.QUERY), Owner],
	asyncError(houseController.kickUser),
);
router.get(
	"/:houseId",
	[Auth, SchemaValidator(paramsSchema, FIELD_TYPES.PARAMS), HouseExist(FIELD_TYPES.PARAMS), BelongsToHouse],
	asyncError(houseController.getById),
);
router.put(
	"/:houseId",
	[
		SchemaValidator(paramsSchema, FIELD_TYPES.PARAMS),
		SchemaValidator(updateHouseSchema, FIELD_TYPES.BODY),
		Auth,
		HouseExist(FIELD_TYPES.PARAMS),
		Owner,
	],
	asyncError(houseController.update),
);
router.delete(
	"/:houseId",
	[Auth, SchemaValidator(paramsSchema, FIELD_TYPES.PARAMS), HouseExist(FIELD_TYPES.PARAMS), Owner],
	asyncError(houseController.delete),
);

export default router;
