import { Request, Response } from "express";

import authFacade from "@/facades/auth.facade";

class AuthControler {
	public async register(req: Request, res: Response): Promise<Response | undefined> {
		return authFacade.register(req, res);
	}

	public async login(req: Request, res: Response): Promise<Response | undefined> {
		return authFacade.login(req, res);
	}
}

export default new AuthControler();
