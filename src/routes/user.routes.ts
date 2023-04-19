import express from "express";

import asyncError from "@/middlewares/asyncError.middleware";
import { Auth } from "@/middlewares/auth.middleware";

import userController from "../controllers/user.controller";

const router = express.Router();

router.get("/list", Auth, asyncError(userController.listUsers)); //should be disabled
router.get("/profile", Auth, asyncError(userController.profile));
router.get("/houses", Auth, asyncError(userController.getHouses));
router.get("/getInfo/:id", Auth, asyncError(userController.getUserInfo));
router.delete("/delete/:id", Auth, asyncError(userController.deleteUser));

export default router;
