import Joi from "joi";

const createTaskSchema: Joi.ObjectSchema = Joi.object({
	name: Joi.string().required(),
	description: Joi.string().required(),
	house_id: Joi.string().required(),
	users_id: Joi.array().required(),
	days: Joi.array().items(Joi.string().valid("MO", "TU", "WE", "TH", "FR", "SA", "SU")).optional(),
	start_date: Joi.date().required(),
	end_date: Joi.date().required(),
	repeat: Joi.boolean().required(),
	until_date: Joi.date().optional(),
});

const updateTaskSchema: Joi.ObjectSchema = Joi.object({
	name: Joi.string().required(),
	description: Joi.string().required(),
	users_id: Joi.array().required(),
	days: Joi.array().items(Joi.string().valid("MO", "TU", "WE", "TH", "FR", "SA", "SU")).optional(),
	start_date: Joi.date().required(),
	end_date: Joi.date().required(),
	repeat: Joi.boolean().required(),
	until_date: Joi.date().optional(),
});

const paramsSchema: Joi.ObjectSchema = Joi.object({
	id: Joi.string().required(),
});

const querySchema: Joi.ObjectSchema = Joi.object({
	user_id: Joi.string().optional(),
	house_id: Joi.string().required(),
});

export { createTaskSchema, paramsSchema, querySchema, updateTaskSchema };
