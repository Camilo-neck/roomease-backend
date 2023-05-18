import mongoose from "mongoose";

import { IHouse } from "../../dtos/Ihouse.dto";
import taskModel from "./task.model";
import userModel from "./user.model";

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

houseSchema.post("save", async (doc) => {
	await userModel.updateOne({ _id: doc.owner }, { $push: { houses: doc._id.toString() } });
});

houseSchema.post("deleteOne", async (doc) => {
	await userModel.updateMany({ $pull: { houses: doc._id } });
	await taskModel.deleteMany({ house_id: doc._id });
});

const houseModel = mongoose.model<IHouse>("House", houseSchema);

export default houseModel;

// Convert String to Schema.Types.ObjectId with map later
