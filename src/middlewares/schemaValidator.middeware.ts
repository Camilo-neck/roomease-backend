import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

import { STATUS_CODES } from "@/utils/constants";

export const SchemaValidator = (schema: ObjectSchema) => {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			if (!schema) {
				return res.status(STATUS_CODES.BAD_REQUEST).json({
					message: "Schema not provided",
				});
			}
			const { error } = schema.validate(req.body);
			if (error) {
				return res.status(400).json({
					message: error.details[0].message,
				});
			}
			next();
		} catch (error) {
			console.error(error);
			return res.status(STATUS_CODES.INTERNAL_ERROR).json({
				message: "Internal server error",
			});
		}
	};
};
