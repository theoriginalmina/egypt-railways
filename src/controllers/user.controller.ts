import type { Request, Response, NextFunction } from "express";
import UserService from "../services/user.service";
import { autoInjectable } from "tsyringe";
import ApiError from "../utils/ApiError";

interface MM extends Request {
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

	createUser = async (req: MM, res: Response, next: NextFunction) => {
		try {
			const { email, password } = req.body;
			await this.userService.createUser({ email, password });
		} catch (err) {
			const { code } = err;
			if (code === "23505") {
				return next(ApiError.badRequest("Email already exists"));
			}
			return next(ApiError.internal("Something went wrong"));
		}

		return res.status(201).json("User created successfully");
	};
}

export default UserController;
