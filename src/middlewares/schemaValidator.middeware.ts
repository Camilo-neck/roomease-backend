import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

export const SchemaValidator = (schema: ObjectSchema): ((...args: any[]) => any) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const { error } = schema.validate(req.body);
		if (error) {
			return res.status(400).json({
				message: error.details[0].message,
			});
		}
		next();
	};
};
