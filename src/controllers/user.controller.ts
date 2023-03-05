import { Request, Response } from "express";

import { users } from "../data";
import userModel from "../models/user.model";

async function createUser(req: Request, res: Response) {
	try {
		// Insert test data into the database
		await userModel.insertMany(users);

		res.status(201).json({ message: "User created" });

		/* const { name, email, password } = req.body;
		const user = new userModel({ name, email, password });
		const savedUser = await user.save();
		res.status(201).json(savedUser); */
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
}

async function getUsers(req: Request, res: Response) {
	try {
		const users = await userModel.find();
		res.status(200).json(users);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
}

export { createUser, getUsers };
