import PusherServer from "pusher";

export const pusher = new PusherServer({
	appId: process.env.PUSHER_APP_ID ?? "",
	key: process.env.PUSHER_APP_KEY ?? "",
	secret: process.env.PUSHER_APP_SECRET ?? "",
	cluster: "us2",
	useTLS: true,
});
