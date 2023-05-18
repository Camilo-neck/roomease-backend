import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Document, ObjectId } from "mongoose";

import userModel from "../db/models/user.model";
import { IUser } from "../dtos/Iuser.dto";
import { ServerError } from "../errors/server.error";
import { STATUS_CODES } from "../utils/constants";

class AuthFacade {
	public async register(req: Request, res: Response): Promise<Response | undefined> {
		const { name, email, password, birth_date, phone, description, tags }: IUser = req.body;

		// Check if a user with the same email already exists
		const existingUser: Document<IUser> | null = await userModel.findOne({ email });
		if (existingUser) throw new ServerError("User already exists", STATUS_CODES.BAD_REQUEST);

		const user: any = new userModel({ name, email, password, birth_date, phone, description, tags });
		user.password = await user.encryptPassword(password);
		await user.save();

		//token
		const token: string = generateToken(user._id);
		// Refresh token
		const refreshToken: string = generateRefreshToken(user._id);

		return res.header("auth-token", token).status(STATUS_CODES.CREATED).json({
			message: "User created successfully",
			refreshToken,
		});
	}

	public async login(req: Request, res: Response): Promise<Response | undefined> {
		const user: any = await userModel.findOne({ email: req.body.email });
		if (!user) throw new ServerError("Wrong Email", STATUS_CODES.BAD_REQUEST);

		const correctPassword: boolean = await user.validatePassword(req.body.password);
		if (!correctPassword) throw new ServerError("Wrong password", STATUS_CODES.BAD_REQUEST);

		//token
		const token: string = generateToken(user._id);
		// Refresh token
		const refreshToken: string = generateRefreshToken(user._id);

		// add token to response header
		res.setHeader("Access-Control-Expose-Headers", "auth-token");
		return res.header("auth-token", token).status(STATUS_CODES.CREATED).json({ user, refreshToken });
	}

	public async refreshToken(req: Request, res: Response): Promise<Response | undefined> {
		const refreshToken: string | undefined = req.body.refreshToken;
		if (!refreshToken) throw new ServerError("No refresh token provided", STATUS_CODES.BAD_REQUEST);

		try {
			// Verify refresh token
			const decoded: jwt.JwtPayload = verifyRefreshToken(refreshToken);
			if (!decoded) throw new ServerError("Invalid refresh token", STATUS_CODES.BAD_REQUEST);
			// Find user
			const user: any = await userModel.findById(decoded._id);
			if (!user) throw new ServerError("User not found", STATUS_CODES.BAD_REQUEST);
			// Generate new token
			const token: string = generateToken(user._id);

			// add token to response header
			res.setHeader("Access-Control-Expose-Headers", "auth-token");
			return res.header("auth-token", token).status(STATUS_CODES.CREATED).json({ user });
		} catch (error) {
			throw new ServerError("Invalid refresh token", STATUS_CODES.BAD_REQUEST);
		}
	}
}

function generateToken(user_id: ObjectId): string {
	const token: string = jwt.sign({ _id: user_id }, process.env.TOKEN_SECRET || "S26ZNvgSv4", {
		expiresIn: "30m",
	});
	return token;
}

function generateRefreshToken(user_id: ObjectId): string {
	const token: string = jwt.sign({ _id: user_id }, process.env.REFRESH_TOKEN_SECRET || "S2FjZGllZ29k", {
		expiresIn: "7d",
	});
	return token;
}

function verifyToken(token: string): jwt.JwtPayload {
	return jwt.verify(token, process.env.TOKEN_SECRET || "S26ZNvgSv4") as jwt.JwtPayload;
}

function verifyRefreshToken(refreshToken: string): jwt.JwtPayload {
	return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "S2FjZGllZ29k") as jwt.JwtPayload;
}

export default new AuthFacade();
