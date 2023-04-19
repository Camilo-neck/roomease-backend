import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

import { ServerError } from "@/errors/server.error";
import { STATUS_CODES } from "@/utils/constants";

import userModel from "../db/models/user.model";

class AuthFacade {
	public async register(req: Request, res: Response): Promise<Response | undefined> {
		const { name, email, password, birth_date, phone, description, tags } = req.body;

		// Check if a user with the same email already exists
		const existingUser = await userModel.findOne({ email });
		if (existingUser) throw new ServerError("User already exists", STATUS_CODES.BAD_REQUEST);

		const user = new userModel({ name, email, password, birth_date, phone, description, tags });
		user.password = await user.encryptPassword(password);
		const savedUser = await user.save();

		//token
		const token: string = generateToken(user._id);

		return res.header("auth-token", token).status(STATUS_CODES.CREATED).json({
			message: "User created successfully",
		});
	}

	public async login(req: Request, res: Response): Promise<Response | undefined> {
		const user = await userModel.findOne({ email: req.body.email });
		if (!user) throw new ServerError("Wrong Email", STATUS_CODES.BAD_REQUEST);

		const correctPassword: boolean = await user.validatePassword(req.body.password);
		if (!correctPassword) throw new ServerError("Wrong password", STATUS_CODES.BAD_REQUEST);

		//token
		const token: string = generateToken(user._id);

		// add token to response header
		res.setHeader("Access-Control-Expose-Headers", "auth-token");
		return res.header("auth-token", token).status(STATUS_CODES.CREATED).json(user);
	}
}

function generateToken(user_id: ObjectId): string {
	const token = jwt.sign({ _id: user_id }, process.env.TOKEN_SECRET || "S26ZNvgSv4");
	return token;
}

export default new AuthFacade();
