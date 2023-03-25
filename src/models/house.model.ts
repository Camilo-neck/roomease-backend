import mongoose from "mongoose";

import houseSchema from "../schemas/houses.schema";

export interface IHouse extends Document {
	name: string;
	owner: string;
	house_code: string;
	description: string;
	house_picture: string;
	address: string;
	tags: string[];
	users: string[];
	pending_users: string[];
}

const houseModel = mongoose.model<IHouse>("House", houseSchema);

export default houseModel;
