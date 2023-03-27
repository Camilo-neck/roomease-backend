import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JsonWebTokenError } from "jsonwebtoken";

interface IPayload {
	_id: string;
	iat: number;
	exp: number;
}

export const Auth = (req: Request, res: Response, next: NextFunction) => {
	console.log("IN: AUTH MIDDLEWARE");
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

		console.log("OUT: AUTH MIDDLEWARE");
		next();
		//catch JsonWebTokenError
	} catch (error) {
		if (error instanceof JsonWebTokenError) {
			return res.status(401).json({ message: "Invalid or expired token" });
		} else {
			return res.status(500).json({ message: "Internal server error" });
		}
	}
};
