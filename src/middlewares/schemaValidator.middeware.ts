import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

import { STATUS_CODES } from "@/utils/constants";
import { FIELD_TYPES } from "@/utils/constants";

export const SchemaValidator = (schema: ObjectSchema, type: string): ((...args: any[]) => any) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const requestObject = type === FIELD_TYPES.BODY ? req.body : type === FIELD_TYPES.PARAMS ? req.params : req.query;
		console.log(requestObject);
		const { error } = schema.validate(requestObject);
		if (error) {
			return res.status(STATUS_CODES.BAD_REQUEST).json({
				message: error.details[0].message,
			});
		}
		next();
	};
};
