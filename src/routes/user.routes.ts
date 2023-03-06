import express from "express";

import userController from "../controllers/user.controller";

const router = express.Router();

router.post("/users", userController.createUser);
router.get("/users", userController.listUsers);

export default router;
