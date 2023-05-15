import { Request, Response } from "express";

import notificationFacade from "@/facades/notification.facade";

class NotificationController {
	public async list(req: Request, res: Response): Promise<Response | undefined> {
		return notificationFacade.list(req, res);
	}
	public async delete(req: Request, res: Response): Promise<Response | undefined> {
		return notificationFacade.delete(req, res);
	}
}

export default new NotificationController();
