import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JsonWebTokenError } from "jsonwebtoken";

interface IPayload {
	_id: string;
	iat: number;
	exp: number;
}

export const TokenValidation = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const token = req.header("auth-token");
	if (!token) {
		return res.status(401).json("No token provided");
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
			return res.status(401).json("Invalid or expired token");
		} else {
			return res.status(500).json("Internal server error");
		}
	}
};
