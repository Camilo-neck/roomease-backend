import express from "express";

import helloController from "@/controllers/hello.controller";
import asyncHandler from "@/middlewares/asyncHandler.middleware";

const router = express.Router();

router.get("/", asyncHandler(helloController.hello));

export default router;
