import { autoInjectable } from "tsyringe";
import { IUser } from "../interfaces/user.interface";
import UserRepository from "../repositories/user.repository";

@autoInjectable()
class UserService {
	userRepo: UserRepository;

	constructor(userRepo: UserRepository) {
		this.userRepo = userRepo;
	}

	createUser = async ({ email, password }: IUser) => {
		await this.userRepo.createUser({ email, password });
	};
}

export default UserService;
