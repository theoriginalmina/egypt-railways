import RedisStore from "connect-redis";
import type { Express } from "express";
import express, { json } from "express";
import session from "express-session";
import helmet from "helmet";
import { createClient } from "redis";
import "reflect-metadata";
import type { DataSource } from "typeorm";
import apiErrorHandler from "./middlewares/api-error-handler";
import routes from "./routes";

class Server {
	mainDB: DataSource;
	app: Express;
	server: import("http").Server<
		typeof import("http").IncomingMessage,
		typeof import("http").ServerResponse
	>;
	port = process.env.PORT;

	redisClient = createClient();

	redisStore = new RedisStore({
		client: this.redisClient,
		prefix: "myapp:",
		disableTouch: true,
	});

	constructor(mainDB: DataSource) {
		this.mainDB = mainDB;
		this.app = express();
		this.setup();
	}

	setup() {
		this.app.use(helmet());
		this.app.use(json());
		this.app.use(
			session({
				name: "qid",
				store: this.redisStore,
				cookie: {
					maxAge: 1000 * 60 * 60 * 24 * 365, // one year
					httpOnly: true,
					sameSite: "lax",
					// secure: true
				},
				secret: "ssssss",
				resave: false,
				saveUninitialized: false,
			})
		);
		this.app.use("/api/v1", routes);
		this.app.use(apiErrorHandler);
		this.app.use((_req, res) => {
			res.status(404).send("Sorry can't find that!");
		});
	}

	run() {
		this.server = this.app.listen(this.port, () => {
			console.log(`Server is running port ${this.port}`);
		});

		this.mainDB
			.initialize()
			.then(() => {
				console.log("Data Source has been initialized!");
			})
			.catch((err) => {
				console.error("Error during Data Source initialization:", err);
			});

		this.redisClient.connect().catch(console.error);
	}

	connectToDBs = async () => {
		await this.mainDB.initialize();
		// this.redisClient.connect().catch(console.error);
	};

	disconnectToDBs = async () => {
		await this.mainDB.destroy();
		// await this.redisClient.disconnect();
	};

	stop(done: ((err?: Error | undefined) => void) | undefined) {
		this.server.close(done);
	}
}

export default Server;
