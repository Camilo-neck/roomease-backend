import Joi from "joi";

const updateUserSchema: Joi.ObjectSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().email().required(),
	password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
	birth_date: Joi.date().required(),
	phone: Joi.string().required(),
	description: Joi.string().required(),
	profile_picture: Joi.string().optional(),
	tags: Joi.array().items(Joi.string()).optional(),
	scores: Joi.array().items(Joi.string()).required(),
}).options({ abortEarly: false });

const paramsSchema: Joi.ObjectSchema = Joi.object({
	id: Joi.string().required(),
});

const leaveSchema: Joi.ObjectSchema = Joi.object({
	id: Joi.string().required(),
	houseId: Joi.string().required(),
});

export { leaveSchema, paramsSchema, updateUserSchema };
