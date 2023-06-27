import { hash } from "bcrypt";

const hashStr = async (password: string) => {
	const saltRounds = 10;

	const hashedStr = await hash(password, saltRounds);

	return hashedStr;
};

export default hashStr;
