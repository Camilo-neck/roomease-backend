import express from "express";

import { Auth } from "@/middlewares/auth.middleware";
import { BelongsToHouse } from "@/middlewares/belongsToHouse.middleware";

import houseController from "../controllers/house.controller";

const router = express.Router();

router.get("/list", Auth, houseController.list); //should be disabled
router.post("/create", Auth, houseController.create);
router.get("/:houseId", [Auth, BelongsToHouse], houseController.getById);

export default router;
