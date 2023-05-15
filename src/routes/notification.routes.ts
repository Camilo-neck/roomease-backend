import express from "express";

import asyncError from "@/middlewares/asyncError.middleware";
import { Auth } from "@/middlewares/auth.middleware";

import notificationController from "../controllers/notification.controller";

const router = express.Router();

router.get("/", [Auth], asyncError(notificationController.list));
router.delete("/:notification_id", [Auth], asyncError(notificationController.delete));

export default router;
