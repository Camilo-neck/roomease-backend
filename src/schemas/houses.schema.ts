import mongoose from "mongoose";

const houseSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		owner: { type: String, required: true },
		house_code: { type: String, required: true },
		description: { type: String, required: true },
		house_picture: { type: String, required: false },
		address: { type: String, required: true },
		tags: { type: [String], required: true },
		users: { type: [String], required: true },
		pending_users: { type: [String], required: true },
	},
	{ timestamps: true },
);

export default houseSchema;
