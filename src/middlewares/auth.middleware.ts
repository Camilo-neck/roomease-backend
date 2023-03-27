import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JsonWebTokenError } from "jsonwebtoken";

import { STATUS_CODES } from "@/utils/constants";

interface IPayload {
	_id: string;
	iat: number;
	exp: number;
}

export const Auth = (req: Request, res: Response, next: NextFunction) => {
	const token = req.header("auth-token");
	if (!token) {
		return res
			.status(STATUS_CODES.UNAUTHORIZED)
			.json({ message: "No token provided" });
	}

	try {
		const payload = jwt.verify(
			token,
			process.env.TOKEN_SECRET || "S26ZNvgSv4",
		) as IPayload;

		req.userId = payload._id;
		next();
		//catch JsonWebTokenError
	} catch (error) {
		if (error instanceof JsonWebTokenError) {
			return res
				.status(STATUS_CODES.UNAUTHORIZED)
				.json({ message: "Invalid or expired token" });
		} else {
			return res
				.status(STATUS_CODES.INTERNAL_ERROR)
				.json({ message: "Internal server error" });
		}
	}
};
