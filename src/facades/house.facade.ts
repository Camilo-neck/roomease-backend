import { Request, Response } from "express";

import houseModel from "@/models/house.model";
import userModel from "@/models/user.model";
import { STATUS_CODES } from "@/utils/constants";

class HouseFacade {
	async create(req: Request, res: Response) {
		try {
			const { name, description, house_picture, address, users, tags } =
				req.body;

			if (name.includes("_")) {
				return res
					.status(STATUS_CODES.BAD_REQUEST)
					.json({ message: "Invalid name, name can't contain '_'" });
			}

			users.push(req.userId);

			const house_code = await this.generateCode(name);

			const houseData = {
				name,
				owner: req.userId,
				house_code,
				description,
				house_picture,
				address,
				tags,
				users,
				pending_users: [],
			};

			const house = new houseModel(houseData);
			await house.save();

			await userModel.updateOne(
				{ _id: req.userId },
				{ $push: { houses: house._id.toString() } },
			);

			// const user = await userModel.findOne({ _id: req.userId });
			// user?.houses.push(house._id.toString());
			// await user?.save();

			return res.status(STATUS_CODES.CREATED).json({
				message: "House created successfully",
				house_code,
				_id: house._id.toString(),
			});
		} catch (error) {
			console.error(error);
			return res
				.status(STATUS_CODES.INTERNAL_ERROR)
				.json({ message: "Internal server error" });
		}
	}

	// example

	// {
	//     "name": "House 1",
	//     "description": "House 1 description",
	//     "house_picture": "https://www.google.com",
	//     "address": "House 1 address",
	//     "users": [],
	//     "tags": ["tag1", "tag2"]
	// }

	async list(req: Request, res: Response) {
		try {
			const houses = await houseModel.find();
			return res.status(STATUS_CODES.OK).json(houses);
		} catch (error) {
			console.error(error);
			return res
				.status(STATUS_CODES.INTERNAL_ERROR)
				.json({ message: "Internal server error" });
		}
	}

	async getById(req: Request, res: Response) {
		try {
			let house = undefined;

			const isOwner = req.house.owner === req.userId;
			if (!isOwner) {
				house = await req.house.populate({
					path: "users",
					select: "name email",
				});
				//exclude pending users
				const { pending_users, ...rest } = house._doc;
				house = rest;
			} else {
				house = await req.house.populate([
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

			return res.status(STATUS_CODES.OK).json(house);
		} catch (error) {
			console.error(error);
			return res
				.status(STATUS_CODES.INTERNAL_ERROR)
				.json({ message: "Internal server error" });
		}
	}

	async update(req: Request, res: Response) {
		try {
			const { name, description, house_picture, address, tags } = req.body;
			const house = req.house;

			if (name.includes("_")) {
				return res
					.status(STATUS_CODES.BAD_REQUEST)
					.json({ message: "Invalid name, name can't contain '_'" });
			}

			if (name !== house.name) {
				house.house_code = await this.generateCode(name);
			}
			house.name = name;
			house.description = description;
			house.house_picture = house_picture;
			house.address = address;
			house.tags = tags;
			await house.save();
			return res.status(STATUS_CODES.OK).json({ message: "House modified" });
		} catch (error) {
			console.error(error);
			return res
				.status(STATUS_CODES.INTERNAL_ERROR)
				.json({ message: "Internal server error" });
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const { houseId } = req.params;
			await houseModel.deleteOne({ _id: houseId });
			await userModel.updateMany({ $pull: { houses: houseId } });

			return res.status(STATUS_CODES.OK).json({ message: "House deleted" });
		} catch (error) {
			console.error(error);
			return res
				.status(STATUS_CODES.INTERNAL_ERROR)
				.json({ message: "Internal server error" });
		}
	}

	async join(req: Request, res: Response) {
		try {
			const { house_code } = req.params;
			const house = req.house;

			const user = await userModel.findById(req.userId);

			//check if user is already in house
			const houseId = house._id.toString();
			if (user?.houses.includes(houseId)) {
				return res
					.status(STATUS_CODES.BAD_REQUEST)
					.json({ message: "User already in house" });
			}

			//check if user has a pending request
			if (house.pending_users.includes(req.userId)) {
				return res
					.status(STATUS_CODES.BAD_REQUEST)
					.json({ message: "User already has a pending request" });
			}

			//Add user to pending users
			await houseModel.updateOne(
				{ house_code },
				{ $push: { pending_users: req.userId } },
			);
			return res.status(STATUS_CODES.OK).json({ message: "Request sent" });
		} catch (error) {
			console.error(error);
			return res
				.status(STATUS_CODES.INTERNAL_ERROR)
				.json({ message: "Internal server error" });
		}
	}

	async handleJoin(req: Request, res: Response) {
		try {
			const { userId, accept } = req.body;

			const { houseId } = req.params;
			const house = req.house;

			//check if user has a pending request
			const userHasPendingRequest = house.pending_users.includes(userId);
			if (!userHasPendingRequest) {
				return res
					.status(STATUS_CODES.BAD_REQUEST)
					.json({ message: "User does not have a join request to this house" });
			}

			//Accept join request
			if (accept) {
				await this.acceptRequest(userId, houseId);
				return res
					.status(STATUS_CODES.OK)
					.json({ message: "Request accepted" });
			}

			//Reject join request
			await this.rejectRequest(userId, houseId);
			return res.status(STATUS_CODES.OK).json({ message: "Request rejected" });
		} catch (error) {
			console.error(error);
			return res
				.status(STATUS_CODES.INTERNAL_ERROR)
				.json({ message: "Internal server error" });
		}
	}

	//////////// Helper functions ////////////

	async acceptRequest(userId: string, houseId: string) {
		await houseModel.updateOne(
			{ _id: houseId },
			{ $push: { users: userId }, $pull: { pending_users: userId } },
		);
		await userModel.updateOne({ _id: userId }, { $push: { houses: houseId } });
	}

	async rejectRequest(userId: string, houseId: string) {
		await houseModel.updateOne(
			{ _id: houseId },
			{ $pull: { pending_users: userId } },
		);
	}

	async generateCode(name: string) {
		let house_code;
		let existingHouse;
		do {
			house_code =
				name.replaceAll(" ", "") +
				"_" +
				Math.floor(1000 + Math.random() * 9000);
			existingHouse = await houseModel.findOne({ house_code });
		} while (existingHouse);
		return house_code;
	}
}

export default new HouseFacade();
