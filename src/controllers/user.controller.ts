import type { NextFunction, Response } from "express";
import { autoInjectable } from "tsyringe";
import { User } from "../entities/User";
import { LoginRequest, RegisterRequest } from "../interfaces/user.interface";
import UserService from "../services/user.service";
import ApiError from "../utils/ApiError";

@autoInjectable()
class UserController {
	private userService: UserService;

	constructor(userService: UserService) {
		this.userService = userService;
	}

	register = async (
		req: RegisterRequest,
		res: Response,
		next: NextFunction
	) => {
		let user: User;
		try {
			const { email, password } = req.body;

			user = await this.userService.register({
				email,
				password,
			});
		} catch (err) {
			const { code } = err;
			if (code === "23505") {
				return next(ApiError.conflict("Email already exists"));
			}
			return next(ApiError.internal("Something went wrong"));
		}

		req.session.userId = user.id;

		return res.status(201).json({
			id: user.id,
			email: user.email,
		});
	};

	login = async (req: LoginRequest, res: Response, next: NextFunction) => {
		const { email, password } = req.body;

		let user: User | null;

		try {
			user = await this.userService.login({ email, password });
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
