import express from "express";

import { createUser, getUsers } from "../controllers/user.controller";

const router = express.Router();

router.post("/users", createUser);
router.get("/users", getUsers);

export default router;
