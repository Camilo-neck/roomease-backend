import "dotenv/config";

import express from "express";
import mongoose from "mongoose";

import { App } from "./app";

import config from "./config/config";
import userRoutes from "./routes/user.routes";

const app = new App();

mongoose
	.connect(config.mongo.url, { retryWrites: true, w: "majority" })
	.then(() => {
		console.log("connected");
	})
	.catch((error) => {
		console.log(error);
	});

// Parse JSON request bodies
app.app.use(express.json());

// Configure routes
app.app.use("/", userRoutes);

app.app.listen(process.env.PORT, () => {
	console.log(`Server is now listening on PORT ${process.env.PORT}`);
});
