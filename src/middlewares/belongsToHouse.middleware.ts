import { NextFunction, Request, Response } from "express";

import { STATUS_CODES } from "@/utils/constants";

export const BelongsToHouse = (req: Request, res: Response, next: NextFunction) => {
	const user_id = req.userId;
	const house = req.house;

	//if user_id is not in house users
	if (house.users.indexOf(user_id) === -1) {
		return res.status(STATUS_CODES.BAD_REQUEST).json({
			message: "User not belongs to this house",
		});
	}

	return next();
};
