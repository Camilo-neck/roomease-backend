import { Request, Response } from "express";

import notificationModel from "@/db/models/notification.model";
import { NOTIFICATION_TYPES, STATUS_CODES } from "@/utils/constants";

class NotificationFacade {
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

export const create_notifications = async (data: any) => {
	const notificationsData = data.recipients.map((recipient: any) => {
		return get_notification_data({ ...data, recipient, recipients: undefined });
	});

	await notificationModel.insertMany(notificationsData);
};

function get_notification_data(data: any): any {
	const notificationData: any = {};

	const type = data.type;
	const recipient_id = data.recipient;

	const house_name = data.house_name;
	const task_name = data.task_name;
	const user_name = data.user_name;

	switch (type) {
		case NOTIFICATION_TYPES.ACCEPTED_JOIN:
			notificationData.description = `Tu solicitud para unirte a la casa ${house_name} ha sido aceptada`;
			notificationData.title = `Solicitud aceptada`;
			break;

		case NOTIFICATION_TYPES.REJECTED_JOIN:
			notificationData.description = `Tu solicitud para unirte a la casa ${house_name} ha sido rechazada`;
			notificationData.title = `Solicitud rechazada`;
			break;

		case NOTIFICATION_TYPES.REQUEST_JOIN:
			notificationData.description = `El usuario ${user_name} quiere unirse a tu casa ${house_name}`;
			notificationData.title = `Solicitud de unión`;
			break;

		case NOTIFICATION_TYPES.ASSIGNED_TASK:
			notificationData.description = `Se te ha asignado la tarea ${task_name} en la casa ${house_name}`;
			notificationData.title = `Tarea asignada`;
			break;

		case NOTIFICATION_TYPES.COMPLETED_TASK:
			notificationData.description = `La tarea ${task_name} ha sido completada en la casa ${house_name}`;
			notificationData.title = `Tarea completada`;
			break;

		case NOTIFICATION_TYPES.USER_KICKED:
			notificationData.description = `Has sido expulsado de la casa ${house_name}`;
			notificationData.title = `Expulsado`;
			break;
	}

	notificationData.recipient = recipient_id;
	notificationData.type = type;

	notificationData.read = false;

	return notificationData;
}

export default new NotificationFacade();
