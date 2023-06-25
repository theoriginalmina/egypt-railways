import type {
	ErrorRequestHandler,
	Request,
	NextFunction,
	Response,
} from "express";
import ApiError from "../utils/ApiError";

const apiErrorHandler = (
	err: ErrorRequestHandler,
	_req: Request,
	res: Response,
	next: NextFunction
) => {
	// console.log("ECSDCSDdC", err);

	if (err instanceof ApiError) {
		return res.status(err.code).json(err.msg);
	}

	return res.status(500).json(ApiError.internal("Something went wrong"));
	next();
};

export default apiErrorHandler;
