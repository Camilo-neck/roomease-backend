import Joi from "joi";

const createHouseSchema: Joi.ObjectSchema = Joi.object({
	name: Joi.string().required(),
	description: Joi.string().required(),
	house_picture: Joi.string().required(),
	address: Joi.string().required(),
	users: Joi.array().required(),
	tags: Joi.array().required(),
});

const updateHouseSchema: Joi.ObjectSchema = Joi.object({
	name: Joi.string().required(),
	description: Joi.string().required(),
	house_picture: Joi.string().required(),
	address: Joi.string().required(),
	tags: Joi.array().required(),
});

const handleJoinSchema: Joi.ObjectSchema = Joi.object({
	userId: Joi.string().required(),
	accept: Joi.boolean().required(),
});

const paramsSchema: Joi.ObjectSchema = Joi.object({
	houseId: Joi.string().required(),
});

const paramsHouseCode: Joi.ObjectSchema = Joi.object({
	house_code: Joi.string().required(),
});

export { createHouseSchema, handleJoinSchema, paramsHouseCode,paramsSchema,updateHouseSchema };
