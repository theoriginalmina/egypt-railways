import Joi from "joi";

const searchSchema = Joi.object({
	from: Joi.string().required(),
	to: Joi.string().required(),
	goDay: Joi.number().required(),
	backDay: Joi.number(),
});

export default searchSchema;
