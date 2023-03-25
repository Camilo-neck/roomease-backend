import { Request, Response } from "express";

import userFacade from "@/facades/user.facade";

class UserControler {
	async profile(req: Request, res: Response): Promise<Response | undefined> {
		return userFacade.profile(req, res);
	}
	async listUsers(req: Request, res: Response): Promise<Response | undefined> {
		return userFacade.listUsers(req, res);
	}
	async getHouses(req: Request, res: Response): Promise<Response | undefined> {
		return userFacade.getHouses(req, res);
	}
	async getUserInfo(
		req: Request,
		res: Response,
	): Promise<Response | undefined> {
		return userFacade.getInfo(req, res);
	}
}

export default new UserControler();
