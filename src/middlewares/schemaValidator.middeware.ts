import { NextFunction, Request, Response } from "express";

import { STATUS_CODES } from "@/utils/constants";
import { RouteSchemas } from "@/utils/RouteSchemas/RouteSchemas";

export const SchemaValidator = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const route: string = getCleanRoute(req.baseUrl + req.path, req);
		const schema = RouteSchemas[route];
		if (!schema) {
			return res
				.status(STATUS_CODES.INTERNAL_ERROR)
				.json({ message: `Route ${req.baseUrl + req.path} has no schema` });
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
		return res
			.status(STATUS_CODES.INTERNAL_ERROR)
			.json({ message: "Internal server error" });
	}
};

function getCleanRoute(route: string, req: Request) {
	if (Object.keys(req.params).length > 0) {
		for (const [key, value] of Object.entries(req.params)) {
			route = route.replace(`/${value}`, "");
		}
	}
	return route;
}
