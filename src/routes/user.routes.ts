import express from "express";

import { TokenValidation } from "@/middlewares/verifyToken";

import userController from "../controllers/user.controller";

const router = express.Router();

router.get("/users", userController.listUsers);
router.get("/profile", TokenValidation, userController.profile);

export default router;
