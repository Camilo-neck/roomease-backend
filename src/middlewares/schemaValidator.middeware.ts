import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

import { STATUS_CODES } from "@/utils/constants";

import { STATUS_CODES } from "@/utils/constants";

export const SchemaValidator = (schema: ObjectSchema): ((...args: any[]) => any) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const requestObject = type === "body" ? req.body : type === "query" ? req.query : req.params;
		const { error } = schema.validate(requestObject);
		if (error) {
			return res.status(STATUS_CODES.BAD_REQUEST).json({
				message: error.details[0].message,
			});
		}
		next();
	};
};
