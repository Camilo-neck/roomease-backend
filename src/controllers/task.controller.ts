import { Request, Response } from "express";

import taskFacade from "@/facades/task.facade";

class TaskController {
	async getByHouse(req: Request, res: Response): Promise<Response | undefined> {
		return taskFacade.getByHouse(req, res);
	}
	async getByUser(req: Request, res: Response): Promise<Response | undefined> {
		return taskFacade.getByUser(req, res);
	}
	async create(req: Request, res: Response): Promise<Response | undefined> {
		return taskFacade.create(req, res);
	}
	async update(req: Request, res: Response): Promise<Response | undefined> {
		return taskFacade.update(req, res);
	}
	async delete(req: Request, res: Response): Promise<Response | undefined> {
		return taskFacade.delete(req, res);
	}
	async done(req: Request, res: Response): Promise<Response | undefined> {
		return taskFacade.done(req, res);
	}
	async list(req: Request, res: Response): Promise<Response | undefined> {
		return taskFacade.list(req, res);
	}
}

export default new TaskController();
