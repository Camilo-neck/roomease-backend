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

		const house = new houseModel(houseData);
		await house.save();

		await userModel.updateOne({ _id: req.userId }, { $push: { houses: house._id.toString() } });

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
		const { name, description, house_picture, address, tags } = req.body;
		const house = req.house;

		if (name.includes("_")) throw new ServerError("Invalid name, name can't contain '_'", STATUS_CODES.BAD_REQUEST);

		if (name !== house.name) house.house_code = await generateCode(name);

		house.name = name;
		house.description = description;
		house.house_picture = house_picture;
		house.address = address;
		house.tags = tags;

		await house.save();

		return res.status(STATUS_CODES.OK).json({ message: "House modified" });
	}

	public async delete(req: Request, res: Response): Promise<Response | undefined> {
		const { houseId } = req.params;
		await houseModel.deleteOne({ _id: houseId });
		await userModel.updateMany({ $pull: { houses: houseId } });
		await taskModel.deleteMany({ house_id: houseId });

		return res.status(STATUS_CODES.OK).json({ message: "House deleted" });
	}

	public async join(req: Request, res: Response): Promise<Response | undefined> {
		const { house_code } = req.params;
		const house = req.house;

		const user = await userModel.findById(req.userId);

		//check if user is already in house
		const houseId: string = house._id.toString();
		if (user?.houses.includes(houseId)) {
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
			await acceptRequest(userId, houseId);
			return res.status(STATUS_CODES.OK).json({ message: "Request accepted" });
		}

		//Reject join request
		await rejectRequest(userId, houseId);
		return res.status(STATUS_CODES.OK).json({ message: "Request rejected" });
	}
}

//////////// Helper functions ////////////

async function acceptRequest(userId: string, houseId: string) {
	await houseModel.updateOne({ _id: houseId }, { $push: { users: userId }, $pull: { pending_users: userId } });
	await userModel.updateOne({ _id: userId }, { $push: { houses: houseId } });
}

async function rejectRequest(userId: string, houseId: string) {
	await houseModel.updateOne({ _id: houseId }, { $pull: { pending_users: userId } });
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

export default new HouseFacade();
