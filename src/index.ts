import "dotenv/config";
import "reflect-metadata";
import Server from "./Server";
import AppDataSource from "./app-data-source";

const server = new Server(AppDataSource);
server.run();

export default server;
