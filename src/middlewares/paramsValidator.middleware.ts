import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

import { STATUS_CODES } from "@/utils/constants";

export const ParamsValidator = (schema: ObjectSchema): ((...args: any[]) => any) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const { error } = schema.validate(req.params);
		if (error) {
			return res.status(STATUS_CODES.BAD_REQUEST).json({
				message: error.details[0].message,
			});
		}
		next();
	};
};
