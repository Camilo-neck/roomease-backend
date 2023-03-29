import "dotenv/config";

import express from "express";

import { App } from "@/app";

import dbConnect from "./dbConnect";
import userRoutes from "./routes/user.routes";

// Create a new express application instance
const app = new App();

// Connect to database
dbConnect();

app.app.listen(process.env.PORT, () => {
	console.log(`Server is now listening on PORT ${process.env.PORT}`);
});
