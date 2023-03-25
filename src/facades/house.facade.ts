import { Request, Response } from "express";

import houseModel from "@/models/house.model";
import userModel from "@/models/user.model";

class HouseFacade {
	async create(req: Request, res: Response) {
		try {
			const { name, description, house_picture, address, users, tags } =
				req.body;

			if (name.includes("#")) {
				return res.status(400).json({ message: "Invalid name" });
			}

			const owner = await userModel.findOne({ _id: req.userId });
			if (!owner) {
				return res.status(404).json({ message: "Owner not found" });
			}
			users.push(owner._id);

			const house_code =
				name.replace(" ", "_") + "#" + Math.floor(1000 + Math.random() * 9000);

			const existingHouse = await houseModel.findOne({ house_code });
			if (existingHouse) {
				return res.status(409).json({ message: "House already exists" });
			}

			const houseData = {
				name,
				owner: owner._id,
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

			return res.status(201).json({
				message: "House created successfully",
				house_code,
			});
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Internal server error" });
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
			return res.status(200).json(houses);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Internal server error" });
		}
	}

	async getById(req: Request, res: Response) {
		try {
			const { houseId } = req.params;
			const house = await houseModel.find({ _id: houseId });
			if (house.length > 0) {
				return res.status(200).json(house);
			}
			return res.status(404).json({ message: "House not found" });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Internal server error" });
		}
	}
}

export default new HouseFacade();
