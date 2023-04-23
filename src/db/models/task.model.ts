import mongoose from "mongoose";

import { ITask } from "@/dtos/ITask.dto";

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

const taskModel = mongoose.model<ITask>("Task", taskSchema);

export default taskModel;
