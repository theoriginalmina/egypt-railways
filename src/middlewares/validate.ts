import type { Schema } from "joi";
import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";

const validate = (schema: Schema) => {
	return async (req: Request, _res: Response, next: NextFunction) => {
		const values = req.body;

		try {
			await schema.validateAsync(values);
		} catch (error) {
			const { message } = error;
			return next(ApiError.badRequest(message));
		}

		req.body = values;
		next();
		// validate;
	};
};

export default validate;
