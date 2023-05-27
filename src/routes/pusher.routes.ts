import express from "express";

import pusherController from "@/controllers/pusher.controller";
import asyncError from "@/middlewares/asyncError.middleware";

const router = express.Router();

router.post("/pusher/auth", asyncError(pusherController.auth));