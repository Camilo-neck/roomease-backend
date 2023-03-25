import mongoose from "mongoose";

import userSchema from "../schemas/user.schema";

export interface IUser extends Document {
	username: string;
	email: string;
	password: string;
	birth_date: Date;
	phone: string;
	description: string;
	profile_picture: string;
	tags: string[];
	scores: string[];
	events: string[];
	houses: string[];
	encryptPassword(password: string): Promise<string>;
	validatePassword(password: string): Promise<boolean>;
}

const userModel = mongoose.model<IUser>("User", userSchema);

export default userModel;
