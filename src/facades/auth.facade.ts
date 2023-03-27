import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { STATUS_CODES } from "@/utils/constants";

import userModel from "../models/user.model";

class AuthFacade {
	async register(req: Request, res: Response) {
		try {
			const {
				name,
				email,
				password,
				birth_date,
				phone,
				description,
				tags,
				// profile_picture,
			} = req.body;

			// Check if a user with the same email already exists
			const existingUser = await userModel.findOne({ email });
			if (existingUser) {
				return res.status(409).json({ message: "User already exists" });
			}

			const user = new userModel({
				name,
				email,
				password,
				birth_date,
				phone,
				description,
				tags,
				// profile_picture,
			});
			user.password = await user.encryptPassword(password);
			const savedUser = await user.save();

			//token
			const token: string = jwt.sign(
				{ _id: savedUser._id },
				process.env.TOKEN_SECRET || "S26ZNvgSv4",
			);

			//save token in client side cookie with same duration as token
			res.cookie("token", token, {
				httpOnly: true,
				secure: true,
				sameSite: "none",
				maxAge: 1000 * 60 * 30,
			});

			res.header("auth-token", token).status(STATUS_CODES.CREATED).json({
				message: "User created successfully",
			});
		} catch (error) {
			console.error(error);
			res
				.status(STATUS_CODES.INTERNAL_ERROR)
				.json({ message: "Internal server error" });
		}
	}

	async login(req: Request, res: Response) {
		try {
			const user = await userModel.findOne({ email: req.body.email });
			if (!user)
				return res.status(STATUS_CODES.BAD_REQUEST).json({
					message: "Email or password is wrong",
				});

			console.log(user);

			const correctPassword: boolean = await user.validatePassword(
				req.body.password,
			);
			if (!correctPassword)
				return res.status(STATUS_CODES.BAD_REQUEST).json({
					message: "Email or password is wrong",
				});

			//token
			const token: string = jwt.sign(
				{ _id: user._id },
				process.env.TOKEN_SECRET || "S26ZNvgSv4",
				{
					//expires in 30 min
					expiresIn: "30m",
				},
			);
			// add a new header to the response
			res.setHeader("Access-Control-Expose-Headers", "auth-token");
			res.header("auth-token", token).status(STATUS_CODES.CREATED).json(user);
		} catch (error) {
			console.error(error);
			res
				.status(STATUS_CODES.INTERNAL_ERROR)
				.json({ message: "Internal server error" });
		}
	}
}

export default new AuthFacade();
