import { autoInjectable } from "tsyringe";
import { User } from "../entities/User";
import hashStr from "../helpers/hashPassword";
import unhashStr from "../helpers/unhashPassword";
import { IUser } from "../interfaces/user.interface";
import UserRepository from "../repositories/user.repository";

@autoInjectable()
class UserService {
	private userRepo: UserRepository;

	constructor(userRepo: UserRepository) {
		this.userRepo = userRepo;
	}

	register = async ({ email, password }: IUser): Promise<User> => {
		const hashedPassword = await hashStr(password);
		const user = await this.userRepo.register({
			email,
			password: hashedPassword,
		});

		return user;
	};

	login = async ({ email, password }: IUser): Promise<User | null> => {
		const user = await this.userRepo.login(email);
		const valid = await unhashStr(password, user.password);

		if (!valid) {
			return null;
		}

		return user;
	};
}

export default UserService;
