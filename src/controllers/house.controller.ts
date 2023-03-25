import { Request, Response } from "express";

import houseFacade from "@/facades/house.facade";

class HouseController {
	async create(req: Request, res: Response): Promise<Response | undefined> {
		return houseFacade.create(req, res);
	}
	async list(req: Request, res: Response): Promise<Response | undefined> {
		return houseFacade.list(req, res);
	}
	async getById(req: Request, res: Response): Promise<Response | undefined> {
		return houseFacade.getById(req, res);
	}
}

export default new HouseController();
