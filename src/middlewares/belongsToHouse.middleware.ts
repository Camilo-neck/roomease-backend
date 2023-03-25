import { NextFunction, Request, Response } from "express";

import houseModel from "@/models/house.model";

async function belongsToHouse(req: Request, res: Response, next: NextFunction) {
	try {
		const { houseId } = req.params;

		const house = await houseModel.findOne({ _id: houseId, users: req.userId });
		if (house) {
			return next();
		}

		return res.status(404).json({
			message: "User not belongs to this house or the house doesn't exist",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
}

export const BelongsToHouse = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	return Promise.resolve(belongsToHouse(req, res, next)).catch(next);
};