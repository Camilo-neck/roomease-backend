import { Request, Response } from "express";

import { pusher } from "@/utils/pusher";

class PusherFacade {
	public async auth(req: Request, res: Response): Promise<Response | undefined> {
		const socketId = req.body.socket_id;
		const channel = req.body.channel_name;
		const user_id = req.cookies.user_id;
		const presenceData = {
			user_id,
		};
		const authResponse = pusher.authorizeChannel(socketId, channel, presenceData);
		return res.status(200).send(authResponse);
	}
}

export default new PusherFacade();