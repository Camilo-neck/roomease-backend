import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		birth_date: { type: Date, required: true },
		phone: { type: String, required: true },
		description: { type: String, required: true },
		profile_picture: { type: String, required: true },
		tags: { type: [String], required: true },
		scores: { type: [String], required: true },
		events: { type: [String], required: true },
		houses: { type: [String], required: true },
	},
	{ timestamps: true },
);

userSchema.methods.encryptPassword = async (
	password: string,
): Promise<string> => {
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(password, salt);
};

userSchema.methods.validatePassword = async function (
	password: string,
): Promise<boolean> {
	return await bcrypt.compare(password, this.password);
};

export default userSchema;
