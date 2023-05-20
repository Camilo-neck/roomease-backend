import express from "express";

import helloController from "../controllers/hello.controller";
import asyncError from "../middlewares/asyncError.middleware";

const router = express.Router();

router.get("/", asyncError(helloController.hello));

export default router;
