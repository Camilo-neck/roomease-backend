import mongoose from "mongoose";

import { INotification } from "@/dtos/INotification.dto";

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
	type: { type: String, required: true },
	title: { type: String, required: true },
	description: { type: String, required: true },
	read: { type: Boolean, default: false },
	recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

notificationSchema.post("save", async (doc) => {
	//
});

notificationSchema.post("deleteOne", async (doc) => {
	//
});

const notificationModel = mongoose.model<INotification>("Notification", notificationSchema);

export default notificationModel;
