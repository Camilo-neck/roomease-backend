import { Request, Response } from "express";

import authFacade from "@/facades/auth.facade";

class authControler {
	//use facade to handle the logic
	async register(req: Request, res: Response) {
		return authFacade.register(req, res);
	}

	async login(req: Request, res: Response) {
		return authFacade.login(req, res);
	}
}

export default new authControler();
