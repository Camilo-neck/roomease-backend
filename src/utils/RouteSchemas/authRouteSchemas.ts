import Joi from "joi";

const loginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
});

const registerSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().email().required(),
	password: Joi.string().required(),
	birth_date: Joi.date().required(),
	phone: Joi.string().required(),
	description: Joi.string().required(),
	tags: Joi.array().required(),
	//profile_picture: Joi.string(),
});

export { loginSchema, registerSchema };
