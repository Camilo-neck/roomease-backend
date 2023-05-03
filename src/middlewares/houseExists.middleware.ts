import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";

import houseModel from "@/db/models/house.model";
import { STATUS_CODES } from "@/utils/constants";

async function houseExists(req: Request, res: Response, next: NextFunction) {
	let house_ids = [req.params.houseId, req.body.house_id, req.params.house_code, req.query.house_id];

	house_ids = house_ids.filter(function (element) {
		return element;
	});

	if (house_ids.length > 1) {
		return res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Invalid request, more than one house id sent" });
	}

	if (house_ids.length == 0) {
		return res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Invalid request, house id missing" });
	}

	const house_id = house_ids[0];

	const house = await get_house(house_id);

	if (!house) {
		return res.status(STATUS_CODES.NOT_FOUND).json({ message: "House not found" });
	}

	req.house = house;
	return next();
}

export const HouseExist = (req: Request, res: Response, next: NextFunction) => {
	return Promise.resolve(houseExists(req, res, next)).catch(next);
};

async function get_house(identifier: string) {
	let house = undefined;
	if (Types.ObjectId.isValid(identifier)) {
		house = await houseModel.findOne({ _id: identifier });
	} else house = await houseModel.findOne({ house_code: identifier });

	return house;
}
