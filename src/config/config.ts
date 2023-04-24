import dotenv from "dotenv";

dotenv.config();

const MONGO_URL = "mongodb://127.0.0.1:27017/roomEase";

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
