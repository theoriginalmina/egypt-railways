import type { Express } from "express";
import express, { json } from "express";
import AppDataSource from "./data-source";
import routes from "./routes";
import apiErrorHandler from "./middlewares/api-error-handler";

class Server {
	app: Express;
	server: import("http").Server<
		typeof import("http").IncomingMessage,
		typeof import("http").ServerResponse
	>;
	port = process.env.PORT;

	constructor() {
		this.app = express();
		this.setup();
	}

	setup() {
		// this.app.use(helmet());
		this.app.use(json());
		this.app.use("/", routes);
		this.app.use(apiErrorHandler);
		this.app.use((_req, res) => {
			res.status(404).send("Sorry can't find that!");
		});
	}

	run() {
		this.server = this.app.listen(this.port, () => {
			console.log(`Server is running port ${this.port}`);
		});

		AppDataSource.initialize()
			.then(() => {
				console.log("Data Source has been initialized!");
			})
			.catch((err) => {
				console.error("Error during Data Source initialization:", err);
			});
	}

	stop(done: ((err?: Error | undefined) => void) | undefined) {
		this.server.close(done);
	}
}

export default Server;
