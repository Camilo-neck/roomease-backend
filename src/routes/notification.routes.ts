import express from "express";

import notificationController from "../controllers/notification.controller";
import asyncError from "../middlewares/asyncError.middleware";
import { Auth } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", [Auth], asyncError(notificationController.list));
router.delete("/:notification_id", [Auth], asyncError(notificationController.delete));
router.put("/:notification_id", [Auth], asyncError(notificationController.read));

export default router;
