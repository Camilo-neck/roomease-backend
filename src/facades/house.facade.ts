import { Request, Response } from "express";

import houseModel from "@/db/models/house.model";
import userModel from "@/db/models/user.model";
import { ServerError } from "@/errors/server.error";
import { STATUS_CODES } from "@/utils/constants";

import taskModel from "../db/models/task.model";

class HouseFacade {
	public async create(req: Request, res: Response): Promise<Response | undefined> {
		const { name, users } = req.body;

		if (name.includes("_")) throw new ServerError("Invalid name, name can't contain '_'", STATUS_CODES.BAD_REQUEST);

		users.push(req.userId);

		const house_code = await generateCode(name);
		const houseData = req.body;

		houseData["owner"] = req.userId;
		houseData["pending_users"] = [];
		houseData["users"] = users;
		houseData["house_code"] = house_code;

		if (!houseData["house_picture"])
			houseData["house_picture"] =
				"https://images.adsttc.com/media/images/5d34/e507/284d/d109/5600/0240/large_jpg/_FI.jpg?1563747560";

		const house = new houseModel(houseData);
		await house.save();

		return res.status(STATUS_CODES.CREATED).json({
			message: "House created successfully",
			house_code,
			_id: house._id.toString(),
		});
	}

	public async list(req: Request, res: Response): Promise<Response | undefined> {
		const houses = await houseModel.find();
		return res.status(STATUS_CODES.OK).json(houses);
	}

	public async getById(req: Request, res: Response): Promise<Response | undefined> {
		const isOwner = req.house.owner === req.userId;
		const house = await populateUsers(req.house, isOwner);

		return res.status(STATUS_CODES.OK).json(house);
	}

	public async update(req: Request, res: Response): Promise<Response | undefined> {
		try {
			const { name, description, house_picture, address, tags } = req.body;
			const house = req.house;

			if (name.includes("_")) throw new ServerError("Invalid name, name can't contain '_'", STATUS_CODES.BAD_REQUEST);

			if (name !== house.name) house.house_code = await generateCode(name);

			// house.set({
			// 	name: name,
			// 	description: description,
			// 	house_picture: house_picture,
			// 	address: address,
			// 	tags: tags,
			// });

			//await taskModel.findOneAndUpdate({ _id: id }, updateTask, { new: true });

			await houseModel.updateOne({ _id: house._id }, { name, description, house_picture, address, tags }, { new: true });

			return res.status(STATUS_CODES.OK).json({ message: "House modified" });
		} catch (error: any) {
			console.log(error);
			return res.status(STATUS_CODES.BAD_REQUEST).json({ message: error.message });
		}
	}

	public async delete(req: Request, res: Response): Promise<Response | undefined> {
		const { house_id } = req.params;
		await houseModel.deleteOne({ _id: house_id });

		return res.status(STATUS_CODES.OK).json({ message: "House deleted" });
	}

	public async join(req: Request, res: Response): Promise<Response | undefined> {
		const { house_code } = req.params;
		const house = req.house;

		const user = await userModel.findById(req.userId);

		//check if user is already in house
		const house_id: string = house._id.toString();
		if (user?.houses.includes(house_id)) {
			throw new ServerError("User already in house", STATUS_CODES.BAD_REQUEST);
		}

		//check if user has a pending request
		if (house.pending_users.includes(req.userId)) {
			throw new ServerError("User already has a pending request", STATUS_CODES.BAD_REQUEST);
		}

		//Add user to pending users
		await houseModel.updateOne({ house_code }, { $push: { pending_users: req.userId } });
		return res.status(STATUS_CODES.OK).json({ message: "Request sent" });
	}

	public async handleJoin(req: Request, res: Response): Promise<Response | undefined> {
		const { userId, accept } = req.body;

		const { houseId } = req.params;
		const house = req.house;

		//check if user has a pending request
		const userHasPendingRequest = house.pending_users.includes(userId);
		if (!userHasPendingRequest) {
			throw new ServerError("User doesn't have a pending request", STATUS_CODES.BAD_REQUEST);
		}

		//Accept join request
		if (accept) {
			console.log(userId, houseId);
			await acceptRequest(userId, houseId);
			return res.status(STATUS_CODES.OK).json({ message: "Request accepted" });
		}

		//Reject join request
		await rejectRequest(userId, houseId);
		return res.status(STATUS_CODES.OK).json({ message: "Request rejected" });
	}

	public async leaveHouse(req: Request, res: Response): Promise<Response | undefined> {
		const house_id = req.params.houseId;
		const user_id = req.userId;

		await remove_user(house_id, user_id);

		const house = await houseModel.findById(house_id);

		if (user_id == house?.owner) {
			if (house?.users.length > 0) {
				await houseModel.updateOne({ _id: house_id }, { owner: house?.users[0] });
			} else {
				await houseModel.deleteOne({ _id: house_id });
				await taskModel.deleteMany({ house_id });
				return res.status(STATUS_CODES.OK).json({
					message: "The user leaves the house, the house was deleted because there are no more users left in the house",
				});
			}
		}

		return res.status(STATUS_CODES.OK).json({ message: "User leaves the house" });
	}

	public async kickUser(req: Request, res: Response): Promise<Response | undefined> {
		const { house_id, user_id }: any = req.query;

		const user = await userModel.findById(user_id);
		if (!user) throw new ServerError("User not found", STATUS_CODES.NOT_FOUND);
		if (!req.house.users.includes(user_id))
			throw new ServerError("User doesn't belong to house", STATUS_CODES.BAD_REQUEST);
		if (user_id == req.house.owner)
			throw new ServerError("You can't kick yourself (owner), use /leave instead", STATUS_CODES.BAD_REQUEST);

		await remove_user(house_id, user_id);
		return res.status(STATUS_CODES.OK).json({ message: "User removed from house" });
	}
}

//////////// Helper functions ////////////

async function acceptRequest(userId: string, house_id: string) {
	await houseModel.updateOne({ _id: house_id }, { $push: { users: userId }, $pull: { pending_users: userId } });
	await userModel.updateOne({ _id: userId }, { $push: { houses: house_id } });
}

async function rejectRequest(userId: string, house_id: string) {
	await houseModel.updateOne({ _id: house_id }, { $pull: { pending_users: userId } });
}

async function generateCode(name: string) {
	let house_code;
	let existingHouse;
	do {
		house_code = name.replaceAll(" ", "") + "_" + Math.floor(1000 + Math.random() * 9000);
		existingHouse = await houseModel.findOne({ house_code });
	} while (existingHouse);
	return house_code;
}

async function populateUsers(house: any, isOwner: boolean): Promise<any> {
	let houseData = undefined;
	if (!isOwner) {
		houseData = await house.populate({
			path: "users",
			select: "name email",
		});
		//exclude pending users
		const { pending_users, ...rest } = house._doc;
		houseData = rest;
	} else {
		houseData = await house.populate([
			{
				path: "users",
				select: "name email",
			},
			{
				path: "pending_users",
				select: "name email",
			},
		]);
	}

	return houseData;
}

async function remove_user(house_id: string, user_id: string): Promise<void> {
	await userModel.findByIdAndUpdate(user_id, { $pull: { houses: house_id } }, { new: true });
	//Triger -> ¿Cómo pasarle la constante house_id?. También faltaría poner que cuando una tarea en una casa solo tenga
	// un usuario y este se sale, se elimine la tarea.
	await taskModel.updateMany({ house_id: house_id }, { $pull: { users_id: user_id } });
	await houseModel.updateOne({ _id: house_id }, { $pull: { users: user_id } });
}

export default new HouseFacade();
