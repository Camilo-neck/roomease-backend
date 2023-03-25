import express from "express";

import { Auth } from "@/middlewares/auth.middleware";
import { BelongsToHouse } from "@/middlewares/belongsToHouse.middleware";
import { Owner } from "@/middlewares/owner.middleware";

import houseController from "../controllers/house.controller";

const router = express.Router();

router.get("/list", Auth, houseController.list); //should be disabled
router.post("/create", Auth, houseController.create);
router.get("/:houseId", [Auth, BelongsToHouse], houseController.getById);
router.put("/update/:houseId", [Auth, Owner], houseController.update);
router.delete("/delete/:houseId", [Auth, Owner], houseController.delete);
router.get("/join/:house_code", Auth, houseController.join);

export default router;
