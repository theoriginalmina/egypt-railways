import "dotenv/config";
import "reflect-metadata";
import Server from "./Server";

const server = new Server();
server.run();
