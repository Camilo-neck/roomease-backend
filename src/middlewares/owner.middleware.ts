import { NextFunction, Request, Response } from "express";

import houseModel from "@/models/house.model";
import { STATUS_CODES } from "@/utils/constants";

async function owner(req: Request, res: Response, next: NextFunction) {
	try {
		const { houseId } = req.params;

		const house = await houseModel.findOne({ _id: houseId, owner: req.userId });
		if (house) {
			return next();
		}

		return res.status(STATUS_CODES.NOT_FOUND).json({
			message: "User is not owner of this house or the house doesn't exist",
		});
	} catch (error) {
		console.error(error);
		return res
			.status(STATUS_CODES.INTERNAL_ERROR)
			.json({ message: "Internal server error" });
	}
}

export const Owner = (req: Request, res: Response, next: NextFunction) => {
	return Promise.resolve(owner(req, res, next)).catch(next);
};
