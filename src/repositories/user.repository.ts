import type { Repository } from "typeorm";
import { User } from "../entities/User";
import AppDataSource from "../data-source";
import { IUser } from "../interfaces/user.interface";
import { hash } from "bcrypt";

class UserRepository {
	userRepo: Repository<IUser>;
	constructor() {
		this.userRepo = AppDataSource.getRepository(User);
	}

	createUser = async ({ email, password }: IUser) => {
		const user = new User();
		user.email = email;

		const saltRounds = 10;

		const hashedPassword = await hash(password, saltRounds);

		user.password = hashedPassword;

		await this.userRepo.save(user);
	};
}

export default UserRepository;
