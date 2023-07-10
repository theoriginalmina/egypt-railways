import Server from "../Server";
import supertest from "supertest";
import AppDataSource from "../app-data-source";

const server = new Server(AppDataSource);

const app = server.app;

beforeAll(async () => {
	await server.connectToDBs();
});

afterAll(async () => {
	await server.disconnectToDBs();
});

describe("Main", () => {
	describe("When hit url that does not exists", () => {
		it("it should return 404 and err message", async () => {
			const randomURL = Math.random().toString(36).slice(2, 7);

			const { status, text } = await supertest(app).post(`/${randomURL}`);

			expect(status).toBe(404);
			expect(text).toEqual("Sorry can't find that!");
		});
	});
});
