import mongoose from "mongoose";

import config from "./config/config";

const dbConnect = () => {
	mongoose.connect(config.mongo.url, {
		retryWrites: true,
		w: "majority",
	});

	mongoose.connection.on("connected", () => {
		console.log("Connected to database sucessfully");
	});

	mongoose.connection.on("error", (err) => {
		console.log("Error while connecting to database :" + err);
	});

	mongoose.connection.on("disconnected", () => {
		console.log("Mongodb connection disconnected");
	});
};

export default dbConnect;
