import type { Repository } from "typeorm";
import AppDataSource from "../app-data-source";
import { User } from "../entities/User";
import { IUser } from "../interfaces/user.interface";

class UserRepository {
	private userRepository: Repository<User>;

	constructor() {
		this.userRepository = AppDataSource.getRepository(User);
	}

	register = async ({ email, password }: IUser): Promise<User> => {
		const user = new User();
		user.email = email;
		user.password = password;

		await this.userRepository.save(user);

		return user;
	};

	login = async (email: string): Promise<User> => {
		return await this.userRepository.findOneByOrFail({
			email,
		});
	};
}

export default UserRepository;
