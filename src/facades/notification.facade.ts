import { Request, Response } from "express";
import { Document, ObjectId } from "mongoose";

import notificationModel from "@/db/models/notification.model";
import { INotification } from "@/dtos/INotification.dto";
import { NOTIFICATION_TYPES, STATUS_CODES } from "@/utils/constants";

class NotificationFacade {
	public async list(req: Request, res: Response): Promise<Response | undefined> {
		const userId: ObjectId = req.userId;
		const notifications: Document[] = await notificationModel.find({ recipient: userId });
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

export const create_notifications = async (data: ICreateNotification): Promise<void> => {
	const notificationsData: INotification[] = data.recipients.map((recipient: ObjectId) => {
		return get_notification_data({ ...data, recipients: [recipient] });
	});

	await notificationModel.insertMany(notificationsData);
};

function get_notification_data(data: ICreateNotification): INotification {
	const type: NOTIFICATION_TYPES = data.type;
	const recipient_id: ObjectId = data.recipients[0];

	const house_name: string | undefined = data.house_name;
	const task_name: string | undefined = data.task_name;
	const user_name: string | undefined = data.user_name;

	let description = "";
	let title = "";

	switch (type) {
		case NOTIFICATION_TYPES.ACCEPTED_JOIN:
			description = `Tu solicitud para unirte a la casa ${house_name} ha sido aceptada`;
			title = `Solicitud aceptada`;
			break;

		case NOTIFICATION_TYPES.REJECTED_JOIN:
			description = `Tu solicitud para unirte a la casa ${house_name} ha sido rechazada`;
			title = `Solicitud rechazada`;
			break;

		case NOTIFICATION_TYPES.REQUEST_JOIN:
			description = `El usuario ${user_name} quiere unirse a tu casa ${house_name}`;
			title = `Solicitud de unión`;
			break;

		case NOTIFICATION_TYPES.ASSIGNED_TASK:
			description = `Se te ha asignado la tarea ${task_name} en la casa ${house_name}`;
			title = `Tarea asignada`;
			break;

		case NOTIFICATION_TYPES.COMPLETED_TASK:
			description = `La tarea ${task_name} ha sido completada en la casa ${house_name}`;
			title = `Tarea completada`;
			break;

		case NOTIFICATION_TYPES.USER_KICKED:
			description = `Has sido expulsado de la casa ${house_name}`;
			title = `Expulsado`;
			break;
	}

	const notificationData: INotification = {
		recipient: recipient_id,
		type: type,
		read: false,
		description: description,
		title: title,
	};

	return notificationData;
}

interface ICreateNotification {
	type: NOTIFICATION_TYPES;
	recipients: ObjectId[];
	house_name?: string;
	task_name?: string;
	user_name?: string;
}

export default new NotificationFacade();
