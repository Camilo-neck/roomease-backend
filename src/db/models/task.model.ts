import mongoose from "mongoose";

import { ITask } from "@/dtos/ITask.dto";
import { ServerError } from "@/errors/server.error";
import { STATUS_CODES } from "@/utils/constants";

import userModel from "./user.model";

const Schema = mongoose.Schema;

const taskSchema = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		house_id: { type: String, required: true, ref: "House" },
		users_id: { type: [String], required: true, ref: "User" },
		done: { type: Boolean, required: true },
		created_by: { type: String, required: true, ref: "User" },
		days: { type: [String], required: true },
		start_date: { type: Date, required: true },
		end_date: { type: Date, required: true },
		repeat: { type: Boolean, required: true },
		until_date: { type: Date, required: true },
	},
	{ timestamps: true },
);

taskSchema.post("findOneAndUpdate", async (doc) => {
	const task = doc;
	await userModel.updateMany({ $pull: { tasks: task._id } });
	await userModel.updateMany({ _id: { $in: task.users_id } }, { $push: { tasks: task._id.toString() } });
});

taskSchema.post("save", async (doc) => {
	await userModel.updateMany({ _id: { $in: doc.users_id } }, { $push: { tasks: doc._id.toString() } });
});

taskSchema.post("findOneAndDelete", async (doc) => {
	await userModel.updateMany({ $pull: { tasks: doc._id } });
});

// taskSchema.post("findOneAndUpdate", async function (doc, next) {
// 	const session = await mongoose.startSession();
// 	session.startTransaction();
// 	try {
// 		const task = doc;
// 		console.log(task);

// 		await userModel.updateMany({ $pull: { tasks: task._id } }, { session: session, omitUndefined: true });
// 		console.log("pull");

// 		await userModel.updateMany(
// 			{ _id: { $in: task.users_id } },
// 			{ $push: { tasks: task._id.toString() }, session: session, omitUndefined: true },
// 		);
// 		console.log("push");

// 		await session.commitTransaction();
// 		session.endSession();
// 		next();
// 	} catch (error) {
// 		console.log(error);

// 		await session.abortTransaction();
// 		session.endSession();
// 		next();
// 	} finally {
// 		session.endSession();
// 	}
// });

const taskModel = mongoose.model<ITask>("Task", taskSchema);

export default taskModel;
