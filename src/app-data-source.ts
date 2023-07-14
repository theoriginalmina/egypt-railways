import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Trip } from "./entities/Trip";

const AppDataSource = new DataSource({
	type: "postgres",
	host: process.env.DB_HOST,
	port: 5432,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database:
		process.env.NODE_ENV === "test"
			? process.env.TEST_DB_NAME
			: process.env.DB_NAME,
	synchronize: true,
	logging: false,
	entities: [User, Trip],
	subscribers: [],
	migrations: [],
});

export default AppDataSource;
