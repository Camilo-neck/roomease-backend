import dotenv from "dotenv";

dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@roomease.w1usvz8.mongodb.net/roomEase1`;

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 5001;

export const config = {
	mongo: {
		url: MONGO_URL,
	},
	server: {
		port: SERVER_PORT,
	},
};

//EXPORT
export default config;
