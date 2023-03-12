import { Request, Response } from "express";

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
}

export default new UserFacade();
