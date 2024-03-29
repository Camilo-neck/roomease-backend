import { NextFunction, Request, Response } from "express";
import { Document, ObjectId, Types } from "mongoose";

import houseModel from "../db/models/house.model";
import { FIELD_TYPES, STATUS_CODES } from "../utils/constants";

export const HouseExist = (field: string) => {
	async function houseExist(req: Request, res: Response, next: NextFunction) {
		const identifier: string = getIdentifer(field, req) as string;

		if (!identifier) {
			return res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Invalid request, house id missing" });
		}

		const house: Document | null | undefined = await get_house(identifier);

		if (!house) {
			return res.status(STATUS_CODES.NOT_FOUND).json({ message: "House not found" });
		}

		req.house = house;
		return next();
	}

	return (req: Request, res: Response, next: NextFunction) => {
		return Promise.resolve(houseExist(req, res, next)).catch(next);
	};
};

////////////////////////////////

async function get_house(identifier: string): Promise<Document | null | undefined> {
	let house: Document | null | undefined = undefined;
	if (Types.ObjectId.isValid(identifier)) {
		house = await houseModel.findOne({ _id: identifier });
	} else house = await houseModel.findOne({ house_code: identifier });

	return house;
}

function getIdentifer(field: string, req: Request): ObjectId | string | undefined {
	switch (field) {
		case FIELD_TYPES.BODY:
			return req.body.house_id;
		case FIELD_TYPES.PARAMS:
			if (Types.ObjectId.isValid(req.params.houseId)) {
				return req.params.houseId;
			}
			return req.params.house_code;

		case FIELD_TYPES.QUERY:
			return req.query.house_id as string;
	}
}
