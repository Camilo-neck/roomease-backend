import { Request, Response } from "express";

import userFacade from "@/facades/user.facade";

class UserControler {
	async profile(req: Request, res: Response): Promise<void> {
		res.json(await userFacade.profile(req, res)).status(200);
	}
	async listUsers(req: Request, res: Response): Promise<void> {
		res.json(await userFacade.listUsers(req, res)).status(200);
	}
}

export default new UserControler();
