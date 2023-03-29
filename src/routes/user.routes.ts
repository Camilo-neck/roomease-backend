import express from "express";

import { Auth } from "@/middlewares/auth.middleware";
import { USER_ROUTES } from "@/utils/constants";

import userController from "../controllers/user.controller";

const router = express.Router();

router.get(USER_ROUTES.LIST, Auth, userController.listUsers); //should be disabled
router.get(USER_ROUTES.PROFILE, Auth, userController.profile);
router.get(USER_ROUTES.HOUSES, Auth, userController.getHouses);
router.get(USER_ROUTES.GET_INFO, Auth, userController.getUserInfo);

export default router;
