import mongoose from "mongoose";

import { IHouse } from "@/dtos/Ihouse.dto";

const Schema = mongoose.Schema;

const houseSchema = new Schema(
	{
		name: { type: String, required: true },
		owner: { type: String, required: true },
		house_code: { type: String, required: true },
		description: { type: String, required: true },
		house_picture: { type: String, required: false },
		address: { type: String, required: true },
		users: { type: [String], required: true, ref: "User" },
		tags: { type: [String], required: true }, //add ref later
		pending_users: {
			type: [String],
			required: true,
			ref: "User",
		},
	},
	{ timestamps: true },
);

const houseModel = mongoose.model<IHouse>("House", houseSchema);

export default houseModel;

// Convert String to Schema.Types.ObjectId with map later
