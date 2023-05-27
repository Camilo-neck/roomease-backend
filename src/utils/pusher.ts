import PusherServer from "pusher";
import Pusher from "pusher";

export const pusherServer = new PusherServer({
	appId: process.env.PUSHER_APP_ID ?? "",
	key: process.env.PUSHER_APP_KEY ?? "",
	secret: process.env.PUSHER_APP_SECRET ?? "",
	cluster: "us2",
	useTLS: true,
});

export const pusher = new Pusher({
	appId: process.env.PUSHER_APP_ID ?? "",
	key: process.env.PUSHER_APP_KEY ?? "",
	secret: process.env.PUSHER_APP_SECRET ?? "",
	cluster: "us2",
	useTLS: true,
});
