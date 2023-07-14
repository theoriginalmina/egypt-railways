import type { NextFunction, Request, Response } from "express";
import type { Schema } from "joi";
import ApiError from "../utils/ApiError";

const validateBody = (schema: Schema) => {
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
	};
};

const validateQuery = (schema: Schema) => {
	return async (req: Request, _res: Response, next: NextFunction) => {
		const values = req.query;

		try {
			await schema.validateAsync(values);
		} catch (error) {
			const { message } = error;
			return next(ApiError.badRequest(message));
		}

		req.query = values;
		next();
	};
};

export { validateBody, validateQuery };
