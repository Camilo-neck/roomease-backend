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
	async update(req: Request, res: Response): Promise<Response | undefined> {
		return houseFacade.update(req, res);
	}
	async delete(req: Request, res: Response): Promise<Response | undefined> {
		return houseFacade.delete(req, res);
	}
	async join(req: Request, res: Response): Promise<Response | undefined> {
		return houseFacade.join(req, res);
	}
	async handleJoin(req: Request, res: Response): Promise<Response | undefined> {
		return houseFacade.handleJoin(req, res);
	}
}

export default new HouseController();
