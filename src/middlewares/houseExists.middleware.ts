import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";

import houseModel from "@/models/house.model";
import { STATUS_CODES } from "@/utils/constants";

async function houseExists(req: Request, res: Response, next: NextFunction) {
	try {
		const { houseId, house_code } = req.params;
		let house = undefined;

		console.log(houseId, house_code);

		if (houseId) {
			if (!Types.ObjectId.isValid(houseId)) {
				return res
					.status(STATUS_CODES.BAD_REQUEST)
					.json({ message: "Invalid house id" });
			}
			house = await houseModel.findOne({ _id: houseId });
		} else if (house_code) {
			house = await houseModel.findOne({ house_code });
		} else {
			return res
				.status(STATUS_CODES.BAD_REQUEST)
				.json({ message: "Invalid request, house id missing" });
		}

		if (!house) {
			return res
				.status(STATUS_CODES.NOT_FOUND)
				.json({ message: "House not found" });
		}

		req.house = house;
		return next();
	} catch (error) {
		console.error(error);
		return res
			.status(STATUS_CODES.INTERNAL_ERROR)
			.json({ message: "Internal server error" });
	}
}

export const HouseExist = (req: Request, res: Response, next: NextFunction) => {
	return Promise.resolve(houseExists(req, res, next)).catch(next);
};
