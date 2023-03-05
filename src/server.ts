import "dotenv/config";

import express from "express";
import http from "http";
import mongoose from "mongoose";

import { config } from "./config/config";

const port = process.env.PORT || 5001;
const app = express();

mongoose
	.connect(config.mongo.url, { retryWrites: true, w: "majority" })
	.then(() => {
		console.log("connected");
	})
	.catch((error) => {
		console.log(error);
	});

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`Server listening on  http://localhost:${port}`);
});
