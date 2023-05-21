import { ObjectId } from "mongoose";

export interface IUser {
	_id?: ObjectId;
	name: string;
	email: string;
	password: string;
	birth_date: Date;
	phone: string;
	description: string;
	profile_picture: string;
	tags: string[];
	houses: string[];
	encryptPassword(password: string): Promise<string>;
	validatePassword(password: string): Promise<boolean>;
}
