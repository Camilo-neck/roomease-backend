import { Request, Response } from "express";

import taskFacade from "@/facades/task.facade";

class TaskController {
	public async get(req: Request, res: Response): Promise<Response | undefined> {
		return taskFacade.get(req, res);
	}
	public async create(req: Request, res: Response): Promise<Response | undefined> {
		return taskFacade.create(req, res);
	}
	public async update(req: Request, res: Response): Promise<Response | undefined> {
		return taskFacade.update(req, res);
	}
	public async delete(req: Request, res: Response): Promise<Response | undefined> {
		return taskFacade.delete(req, res);
	}
	public async done(req: Request, res: Response): Promise<Response | undefined> {
		return taskFacade.done(req, res);
	}
	public async list(req: Request, res: Response): Promise<Response | undefined> {
		return taskFacade.list(req, res);
	}
}

export default new TaskController();
