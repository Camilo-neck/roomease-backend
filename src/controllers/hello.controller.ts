import { Request, Response } from "express";

import { ServerError } from "../errors/server.error";
import helloFacade from "../facades/hello.facade";
import { STATUS_CODES } from "../utils/constants";

class HelloController {
	public async hello(req: Request, res: Response): Promise<void> {
		// throw new ServerError("Dummy error", STATUS_CODES.BAD_REQUEST);
		res.json(await helloFacade.hello()).status(STATUS_CODES.OK);
	}
}

export default new HelloController();
