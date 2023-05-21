import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { ObjectId } from "mongoose";

import { IUser } from "../../dtos/Iuser.dto";
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
	},
	{ timestamps: true },
);

// userSchema.post("deleteOne", async (doc) => {
// 	await houseModel.updateMany({ $pull: { users: doc._id } });
// 	await taskModel.updateMany({ $pull: { users: doc._id } });
// });

userSchema.post("deleteOne", async function (doc) {
	const session = await mongoose.startSession();
	session.startTransaction();
	console.log("hola");

	try {
		// Eliminar usuario de la colección "houses"
		await houseModel.updateMany({ $pull: { users: doc._id } }, { session });

		// Eliminar usuario de la colección "tasks"
		await taskModel.updateMany({ $pull: { users: doc._id } }, { session });

		// Confirmar la transacción
		await session.commitTransaction();
	} catch (error) {
		// Anular la transacción en caso de error
		await session.abortTransaction();
		console.log(error);
		
	} finally {
		// Finalizar la sesión
		session.endSession();
	}
});

// userSchema.post("findOneAndUpdate", async function (doc) {
// 	console.log("Hola");

// 	doc.password = await doc.encryptPassword(doc.password);
// 	await doc.save();
// });

userSchema.methods.encryptPassword = async (password: string): Promise<string> => {
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(password, salt);
};

userSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
	return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model<IUser>("User", userSchema);

export default userModel;
