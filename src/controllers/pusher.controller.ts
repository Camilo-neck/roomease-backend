import { Request, Response } from "express";

import pusherFacade from "@/facades/pusher.facade";

class PusherController {
	public async auth(req: Request, res: Response): Promise<Response | undefined> {
		return pusherFacade.auth(req, res);
	}
}

export default new PusherController();
