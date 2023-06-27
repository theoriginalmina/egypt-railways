import type { Repository } from "typeorm";
import { User } from "../entities/User";
import AppDataSource from "../data-source";
import { IUser } from "../interfaces/user.interface";

class UserRepository {
	userRepo: Repository<User>;
	constructor() {
		this.userRepo = AppDataSource.getRepository(User);
	}

	createUser = async ({ email, password }: IUser): Promise<User> => {
		const user = new User();
		user.email = email;
		user.password = password;

		await this.userRepo.save(user);

		return user;
	};

	loginUser = async (email: string): Promise<User> => {
		return await this.userRepo.findOneByOrFail({
			email,
		});
	};
}

export default UserRepository;
