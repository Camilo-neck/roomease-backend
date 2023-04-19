import { NextFunction, Request, Response } from "express";

import houseModel from "@/db/models/house.model";
import { STATUS_CODES } from "@/utils/constants";

async function belongsToHouse(req: Request, res: Response, next: NextFunction) {
	const { houseId } = req.params;
	const { house_id } = req.body;

	let house = undefined;

	if (houseId) {
		house = await houseModel.findOne({ _id: houseId, users: req.userId });
	} else if (house_id) {
		house = await houseModel.findOne({ _id: house_id, users: req.userId });
	} else {
		return res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Invalid request, house id missing" });
	}

	if (house) {
		return next();
	}

	return res.status(STATUS_CODES.NOT_FOUND).json({
		message: "User not belongs to this house or the house doesn't exist",
	});
}

export const BelongsToHouse = (req: Request, res: Response, next: NextFunction) => {
	return Promise.resolve(belongsToHouse(req, res, next)).catch(next);
};
