import { Request, Response } from "express";

// import { users } from "../data";
import userModel from "../models/user.model";

class UserControler {
	async createUser(req: Request, res: Response) {
		try {
			const { name, email, password } = req.body;

			// Check if a user with the same email already exists
			const existingUser = await userModel.findOne({ email });
			if (existingUser) {
				return res.status(409).json({ message: "User already exists" });
			}

			const user = new userModel({ name, email, password });
			const savedUser = await user.save();
			res.status(201).json(savedUser);
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Internal server error" });
		}
	}

	async listUsers(req: Request, res: Response) {
		try {
			const users = await userModel.find();
			res.status(200).json(users);
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Internal server error" });
		}
	}
}

export default new UserControler();
