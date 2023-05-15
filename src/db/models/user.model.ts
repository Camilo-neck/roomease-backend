import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { IUser } from "@/dtos/Iuser.dto";

import houseModel from "./house.model";
import taskModel from "./task.model";

const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		birth_date: { type: Date, required: true },
		phone: { type: String, required: true },
		description: { type: String, required: true },
		profile_picture: { type: String, required: false },
		tags: { type: [String], required: false }, //add ref later
		scores: { type: [String], required: true }, //add ref later
		tasks: { type: [String], required: true }, //add ref later
		houses: { type: [String], required: true, ref: "House" },
	},
	{ timestamps: true },
);

userSchema.post("deleteOne", async (doc) => {
	await houseModel.updateMany({ $pull: { users: doc._id } });
	await taskModel.updateMany({ $pull: { users: doc._id } });
});

userSchema.post("findOneAndUpdate", async (doc) => {
	//
});

userSchema.methods.encryptPassword = async (password: string): Promise<string> => {
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(password, salt);
};

userSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
	return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model<IUser>("User", userSchema);

export default userModel;
