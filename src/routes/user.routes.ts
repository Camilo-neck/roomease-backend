import express from "express";

import { Auth } from "@/middlewares/auth.middleware";

import userController from "../controllers/user.controller";

const router = express.Router();

router.get("/list", Auth, userController.listUsers); //should be disabled
router.get("/profile", Auth, userController.profile);
router.get("/houses", Auth, userController.getHouses);

export default router;
