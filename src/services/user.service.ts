import { autoInjectable } from "tsyringe";
import { IUser } from "../interfaces/user.interface";
import UserRepository from "../repositories/user.repository";
import { User } from "../entities/User";
import hashStr from "../helpers/hashPassword";
import unhashStr from "../helpers/unhashPassword";

@autoInjectable()
class UserService {
	userRepo: UserRepository;

	constructor(userRepo: UserRepository) {
		this.userRepo = userRepo;
	}

	createUser = async ({ email, password }: IUser): Promise<User> => {
		const hashedPassword = await hashStr(password);
		const user = await this.userRepo.createUser({
			email,
			password: hashedPassword,
		});

		return user;
	};

	loginUser = async ({ email, password }: IUser): Promise<User | null> => {
		const user = await this.userRepo.loginUser(email);
		const valid = await unhashStr(password, user.password);

		if (!valid) {
			return null;
		}

		return user;
	};
}

export default UserService;
