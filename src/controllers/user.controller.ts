import type { Request, Response, NextFunction } from "express";
import UserService from "../services/user.service";
import { autoInjectable } from "tsyringe";
import ApiError from "../utils/ApiError";
import { User } from "../entities/User";

interface RegisterRequest extends Request {
	body: {
		email: string;
		password: string;
	};
}

interface LoginRequest extends Request {
	body: {
		email: string;
		password: string;
	};
}

@autoInjectable()
class UserController {
	userService: UserService;

	constructor(userService: UserService) {
		this.userService = userService;
	}

	createUser = async (
		req: RegisterRequest,
		res: Response,
		next: NextFunction
	) => {
		let user: User;
		try {
			const { email, password } = req.body;

			user = await this.userService.createUser({
				email,
				password,
			});
		} catch (err) {
			const { code } = err;
			if (code === "23505") {
				return next(ApiError.badRequest("Email already exists"));
			}
			return next(ApiError.internal("Something went wrong"));
		}

		req.session.userId = user.id;

		return res.status(201).json({
			email: user.email,
			password: user.password,
		});
	};

	login = async (req: LoginRequest, res: Response, next: NextFunction) => {
		const { email, password } = req.body;

		let user: User | null;

		try {
			user = await this.userService.loginUser({ email, password });
		} catch (err) {
			return next(ApiError.notFound("User not found"));
		}

		if (!user) {
			return next(ApiError.badRequest("Wrong password"));
		}

		req.session.userId = user.id;

		return res.status(200).json({
			id: user.id,
			email: user.email,
		});
	};
}

export default UserController;
