import express from "express";

import { Auth } from "@/middlewares/auth.middleware";
import { BelongsToHouse } from "@/middlewares/belongsToHouse.middleware";
import { HouseExist } from "@/middlewares/houseExists.middleware";
import { Owner } from "@/middlewares/owner.middleware";

import houseController from "../controllers/house.controller";

const router = express.Router();

router.get("/list", Auth, houseController.list); //should be disabled
router.post("/create", Auth, houseController.create);
router.get(
	"/:houseId",
	[Auth, HouseExist, BelongsToHouse],
	houseController.getById,
);
router.put(
	"/update/:houseId",
	[Auth, HouseExist, Owner],
	houseController.update,
);
router.delete(
	"/delete/:houseId",
	[Auth, HouseExist, Owner],
	houseController.delete,
);
router.get("/join/:house_code", [Auth, HouseExist], houseController.join);
router.post(
	"/handleJoin/:houseId",
	[Auth, HouseExist, Owner],
	houseController.handleJoin,
);

export default router;
