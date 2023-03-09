import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

// import { users } from "../data";
import userModel from "../models/user.model";

class authControler {
	async signup(req: Request, res: Response) {
		try {
			const { name, email, password } = req.body;

			// Check if a user with the same email already exists
			const existingUser = await userModel.findOne({ email });
			if (existingUser) {
				return res.status(409).json({ message: "User already exists" });
			}

			const user = new userModel({ name, email, password });
			user.password = await user.encryptPassword(password);
			const savedUser = await user.save();

			//token
			const token: string = jwt.sign(
				{ _id: savedUser._id },
				process.env.TOKEN_SECRET || "tokentest",
			);

			res.header("auth-token", token).status(201).json(savedUser);
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Internal server error" });
		}
	}

	async signin(req: Request, res: Response) {
		try {
			const user = await userModel.findOne({ email: req.body.email });
			if (!user) return res.status(400).json("Email or password is wrong");

			console.log(user);

			const correctPassword: boolean = await user.validatePassword(
				req.body.password,
			);
			if (!correctPassword) return res.status(400).json("Invalid password");

			//token
			const token: string = jwt.sign(
				{ _id: user._id },
				process.env.TOKEN_SECRET || "tokentest",
				{
					expiresIn: 60 * 60 * 24,
				},
			);
			res.header("auth-token", token).status(201).json(user);
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Internal server error" });
		}
	}

	async profile(req: Request, res: Response) {
		try {
			const user = await userModel.findById(req.userId, { password: 0 });
			if (!user) return res.status(404).json("No user found");

			res.json(user);
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Internal server error" });
		}
	}
}

export default new authControler();
