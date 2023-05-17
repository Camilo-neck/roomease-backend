import { ObjectId } from "mongoose";

export interface ITask {
	name: string;
	description: string;
	house_id: string;
	users_id: ObjectId[];
	done: boolean;
	created_by: ObjectId;

	days?: string[];
	start_date: Date;
	end_date: Date;
	repeat: boolean;
	until_date?: Date;
}
