import { compare } from "bcrypt";

const unhashStr = async (plain: string, hashed: string) => {
	const valid = await compare(plain, hashed);

	return valid;
};

export default unhashStr;
