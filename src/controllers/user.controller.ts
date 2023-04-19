import { Request, Response } from "express";

import userFacade from "@/facades/user.facade";

class UserControler {
	public async profile(req: Request, res: Response): Promise<Response | undefined> {
		return userFacade.profile(req, res);
	}
	public async listUsers(req: Request, res: Response): Promise<Response | undefined> {
		return userFacade.listUsers(req, res);
	}
	public async getHouses(req: Request, res: Response): Promise<Response | undefined> {
		return userFacade.getHouses(req, res);
	}
	public async getUserInfo(req: Request, res: Response): Promise<Response | undefined> {
		return userFacade.getInfo(req, res);
	}
	public async deleteUser(req: Request, res: Response): Promise<Response | undefined> {
		return userFacade.delete(req, res);
	}
}

export default new UserControler();
