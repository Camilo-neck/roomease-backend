import mongoose from "mongoose";

import { INotification } from "@/dtos/INotification.dto";

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
	type: { type: String, required: true },
	description: { type: String, required: true },
});

notificationSchema.post("save", async (doc) => {
	//
});

notificationSchema.post("deleteOne", async (doc) => {
	//
});

const notificationModel = mongoose.model<INotification>("Notification", notificationSchema);

export default notificationModel;
