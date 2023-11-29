import Joi from "joi";

import { NOTIFICATION_TYPES } from "../constants";

const createNotificationSchema: Joi.ObjectSchema = Joi.object({
	type: Joi.string().required(),
	recipient: Joi.string().required(),
	house_id: Joi.string().required(),
	is_read: Joi.boolean().required(),

	//task_name should be needed only for NOTIFICATION_TYPES.ASSIGNED_TASK and NOTIFICATION_TYPES.COMPLETED_TASK
	task_name: Joi.alternatives().conditional("type", {
		is: [NOTIFICATION_TYPES.ASSIGNED_TASK, NOTIFICATION_TYPES.COMPLETED_TASK],
		then: Joi.string().required(),
	}),
});

export { createNotificationSchema };
