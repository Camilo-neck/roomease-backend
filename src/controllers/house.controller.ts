import { Request, Response } from "express";

import houseFacade from "@/facades/house.facade";

class HouseController {
	public async create(req: Request, res: Response): Promise<Response | undefined> {
		return houseFacade.create(req, res);
	}
	public async list(req: Request, res: Response): Promise<Response | undefined> {
		return houseFacade.list(req, res);
	}
	public async getById(req: Request, res: Response): Promise<Response | undefined> {
		return houseFacade.getById(req, res);
	}
	public async update(req: Request, res: Response): Promise<Response | undefined> {
		return houseFacade.update(req, res);
	}
	public async delete(req: Request, res: Response): Promise<Response | undefined> {
		return houseFacade.delete(req, res);
	}
	public async join(req: Request, res: Response): Promise<Response | undefined> {
		return houseFacade.join(req, res);
	}
	public async handleJoin(req: Request, res: Response): Promise<Response | undefined> {
		return houseFacade.handleJoin(req, res);
	}
	public async leaveHouse(req: Request, res: Response): Promise<Response | undefined> {
		return houseFacade.leaveHouse(req, res);
	}
	public async kickUser(req: Request, res: Response): Promise<Response | undefined> {
		return houseFacade.kickUser(req, res);
	}
}

export default new HouseController();
