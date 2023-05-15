import { Request, Response } from "express";

import houseModel from "@/db/models/house.model";
import notificationModel from "@/db/models/notification.model";
import userModel from "@/db/models/user.model";
import { ServerError } from "@/errors/server.error";
import { NOTIFICATION_TYPES, STATUS_CODES } from "@/utils/constants";
import { createNotificationSchema } from "@/utils/RouteSchemas/notificationRouteSchemas";

class NotificationFacade {
	public async create(data: any) {
		const { error } = createNotificationSchema.validate(data);
		if (error) {
			throw new ServerError(error.details[0].message, STATUS_CODES.BAD_REQUEST);
		}

		const user: any = await userModel.findById(data.recipient);
		if (!user) throw new ServerError("User not found", STATUS_CODES.NOT_FOUND);

		const house: any = await houseModel.findById(data.house_id);
		if (!house) throw new ServerError("House not found", STATUS_CODES.NOT_FOUND);

		const notificationData = get_notification_data(data, user, house);

		console.log(notificationData);

		const notification = new notificationModel(notificationData);
		await notification.save();

		return {
			error: false,
			message: "Notification created successfully",
		};
	}

	public async list(req: Request, res: Response): Promise<Response | undefined> {
		const userId = req.userId;
		const notifications = await notificationModel.find({ recipient: userId });
		return res.status(STATUS_CODES.OK).json(notifications);
	}

	public async delete(req: Request, res: Response): Promise<Response | undefined> {
		const { notification_id } = req.params;

		await notificationModel.findByIdAndDelete(notification_id);

		return res.status(STATUS_CODES.OK).json({
			message: "Notification deleted successfully",
		});
	}

	public async read(req: Request, res: Response): Promise<Response | undefined> {
		const { notification_id } = req.params;

		await notificationModel.findByIdAndUpdate(notification_id, { read: true });

		return res.status(STATUS_CODES.OK).json({
			message: "Notification read successfully",
		});
	}
}

function get_notification_data(data: any, user: any, house: any): any {
	const notificationData: any = {};

	const task_name = data.task_name;
	const type = data.type;

	switch (type) {
		case NOTIFICATION_TYPES.ACCEPTED_JOIN:
			notificationData.description = `Tu solicitud para unirte a la casa ${house.name} ha sido "aceptada"`;
			notificationData.title = `Solicitud aceptada`;
			break;

		case NOTIFICATION_TYPES.REJECTED_JOIN:
			notificationData.description = `Tu solicitud para unirte a la casa ${house.name} ha sido "rechazada"`;
			notificationData.title = `Solicitud rechazada`;
			break;

		case NOTIFICATION_TYPES.REQUEST_JOIN:
			notificationData.description = `El usuario ${user.name} quiere unirse a tu casa ${house.name}`;
			notificationData.title = `Solicitud de unión`;
			break;

		case NOTIFICATION_TYPES.ASSIGNED_TASK:
			notificationData.description = `Se te ha asignado la tarea ${task_name} en la casa ${house.name}`;
			notificationData.title = `Tarea asignada`;
			break;

		case NOTIFICATION_TYPES.COMPLETED_TASK:
			notificationData.description = `La tarea ${task_name} ha sido completada en la casa ${house.name}`;
			notificationData.title = `Tarea completada`;
			break;

		case NOTIFICATION_TYPES.USER_KICKED:
			notificationData.description = `Has sido expulsado de la casa ${house.name}`;
			notificationData.title = `Expulsado`;
			break;
	}

	notificationData.recipient = user._id;
	notificationData.type = type;

	return notificationData;
}

export default new NotificationFacade();
