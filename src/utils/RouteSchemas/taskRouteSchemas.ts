import Joi from "joi";

const createTaskSchema: Joi.ObjectSchema = Joi.object({
	name: Joi.string().required(),
	description: Joi.string().required(),
	house_id: Joi.string().required(),
	users_id: Joi.array().required(),
	days: Joi.array()
		.items(Joi.string().valid("LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"))
		.required(),
	hours: Joi.object({
		start: Joi.string()
			.regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
			.required(),
		end: Joi.string()
			.regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
			.required(),
	}).required(),
	repeat: Joi.boolean().required(),
	from_date: Joi.date().required(),
	to_date: Joi.date().required(),
});

const updateTaskSchema: Joi.ObjectSchema = Joi.object({
	name: Joi.string().required(),
	description: Joi.string().required(),
	house_id: Joi.string().required(),
	users_id: Joi.array().required(),
	days: Joi.array()
		.items(Joi.string().valid("LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"))
		.required(),
	hours: Joi.object({
		start: Joi.string()
			.regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
			.required(),
		end: Joi.string()
			.regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
			.required(),
	}).required(),
	repeat: Joi.boolean().required(),
	from_date: Joi.date().required(),
	to_date: Joi.date().required(),
});

export { createTaskSchema, updateTaskSchema };
