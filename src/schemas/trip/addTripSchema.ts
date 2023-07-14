import Joi from "joi";

const addTripSchema = Joi.object({
	from: Joi.string().required(),
	to: Joi.string().required(),
	day: Joi.number().required(),
	train_id: Joi.number().required(),
	departure_time: Joi.string()
		.pattern(new RegExp("^[0-9]{2}:[0-9]{2}:[0-9]{2}"))
		.message("Invalid Departure Time"),
	arrival_time: Joi.string()
		.pattern(new RegExp("^[0-9]{2}:[0-9]{2}:[0-9]{2}"))
		.message("Invalid Arrival Time"),
	price: Joi.number().required(),
});

export default addTripSchema;
