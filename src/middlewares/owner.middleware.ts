import { NextFunction, Request, Response } from "express";

import { STATUS_CODES } from "@/utils/constants";

export const Owner = (req: Request, res: Response, next: NextFunction) => {
	const user_id = req.userId;
	const house = req.house;

	if (house.owner.toString() !== user_id) {
		return res.status(STATUS_CODES.BAD_REQUEST).json({
			message: "User not owner of this house",
		});
	}

	return next();
};
