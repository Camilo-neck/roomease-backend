import { Request, Response } from "express";

import authFacade from "@/facades/auth.facade";

class authControler {
	async login(req: Request, res: Response): Promise<void> {
		res.json(await authFacade.login(req, res)).status(200);
	}
	async register(req: Request, res: Response): Promise<void> {
		res.json(await authFacade.register(req, res)).status(200);
	}
}

export default new authControler();
