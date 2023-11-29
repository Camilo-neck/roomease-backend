import Joi from "joi";

const updateUserSchema: Joi.ObjectSchema = Joi.object({
	name: Joi.string().required(),
	birth_date: Joi.date().required(),
	phone: Joi.string().required(),
	description: Joi.string().required(),
	profile_picture: Joi.string().optional(),
	tags: Joi.array().items(Joi.string()).optional(),
}).options({ abortEarly: false });

const paramsSchema: Joi.ObjectSchema = Joi.object({
	id: Joi.string().required(),
});

export { paramsSchema, updateUserSchema };
