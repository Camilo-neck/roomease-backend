import { ObjectId } from "mongoose";

export interface INotification {
	type: string;
	title: string;
	description: string;
	recipient: ObjectId;
	read: boolean;
}
