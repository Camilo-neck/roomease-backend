import { Request, Response } from "express";

import houseModel from "../models/house.model";
import userModel from "../models/user.model";

class UserFacade {
	async listUsers(req: Request, res: Response) {
		try {
			const users = await userModel.find();
			return res.status(200).json(users);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Internal server error" });
		}
	}

	async profile(req: Request, res: Response) {
		try {
			const user = await userModel.findById(req.userId, { password: 0 });
			if (!user) return res.status(404).json("No user found");

			return res.status(200).json(user);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Internal server error" });
		}
	}

	async getHouses(req: Request, res: Response) {
		try {
			const houses = await houseModel.find(
				{ users: req.userId },
				{
					name: 1,
					house_code: 1,
					description: 1,
					house_picture: 1,
					address: 1,
				},
			);
			return res.status(200).json(houses);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Internal server error" });
		}
	}

	async getInfo(req: Request, res: Response) {
		try {
			const user = await userModel.find(
				{ email: req.body.email },
				{ password: 0 },
			);
			if (!user) return res.status(404).json("No user found");

			return res.status(200).json(user);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Internal server error" });
		}
	}
}

export default new UserFacade();
