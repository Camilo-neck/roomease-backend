import { NextFunction, Request, Response } from "express";

import { ServerError } from "@/errors/server.error";

export default (err: ServerError, _req: Request, res: Response, _next: NextFunction) => {
	console.log(err.code);
	return res.status(err.code).json({
		message: err.message,
	});
};
