import { Request, Response } from "express";

import { STATUS_CODES } from "@/utils/constants";

import houseModel from "../models/house.model";
import userModel from "../models/user.model";

class UserFacade {
	async listUsers(req: Request, res: Response) {
		try {
			const users = await userModel.find();
			return res.status(STATUS_CODES.OK).json(users);
		} catch (error) {
			console.error(error);
			return res
				.status(STATUS_CODES.INTERNAL_ERROR)
				.json({ message: "Internal server error" });
		}
	}

	async profile(req: Request, res: Response) {
		try {
			const user = await userModel.findById(req.userId, { password: 0 });
			if (!user)
				return res.status(STATUS_CODES.NOT_FOUND).json("No user found");

			return res.status(STATUS_CODES.OK).json(user);
		} catch (error) {
			console.error(error);
			return res
				.status(STATUS_CODES.INTERNAL_ERROR)
				.json({ message: "Internal server error" });
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
			return res.status(STATUS_CODES.OK).json(houses);
		} catch (error) {
			console.error(error);
			return res
				.status(STATUS_CODES.INTERNAL_ERROR)
				.json({ message: "Internal server error" });
		}
	}

	async getInfo(req: Request, res: Response) {
		try {
			const user = await userModel.find(
				{ email: req.body.email },
				{ password: 0 },
			);
			if (!user)
				return res.status(STATUS_CODES.NOT_FOUND).json("No user found");

			return res.status(STATUS_CODES.OK).json(user);
		} catch (error) {
			console.error(error);
			return res
				.status(STATUS_CODES.INTERNAL_ERROR)
				.json({ message: "Internal server error" });
		}
	}
}

export default new UserFacade();
