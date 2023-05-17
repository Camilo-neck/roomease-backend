import { ObjectId } from "mongoose";

export interface IHouse {
	_id?: ObjectId;
	name: string;
	owner: ObjectId;
	house_code: string;
	description: string;
	house_picture: string;
	address: string;
	tags: string[];
	users: ObjectId[];
	pending_users: string[];
}
