import supertest from "supertest";
import Server from "../../Server";
import AppDataSource from "../../app-data-source";
import unhashStr from "../../helpers/unhashPassword";

const server = new Server(AppDataSource);
const app = server.app;

const registerURL = "/api/v1/auth/register";
const loginURL = "/api/v1/auth/login";

beforeAll(async () => {
	await server.connectToDBs();
});

afterAll(async () => {
	await AppDataSource.dropDatabase();
	await server.disconnectToDBs();
});

describe("User", () => {
	describe("Register", () => {
		describe("given empty inputs", () => {
			it("should return 400 and error message", async () => {
				const user = {
					email: "",
					password: "",
				};

				const { status, body } = await supertest(app)
					.post(`${registerURL}`)
					.send(user);

				expect(status).toBe(400);
				expect(body).toEqual({
					message: '"email" is not allowed to be empty',
				});
			});
		});

		describe("given empty email", () => {
			it("should return 400 and error message", async () => {
				const user = {
					email: "",
					password: "123456798",
				};

				const { status, body } = await supertest(app)
					.post(`${registerURL}`)
					.send(user);

				expect(status).toBe(400);
				expect(body).toEqual({
					message: '"email" is not allowed to be empty',
				});
			});
		});

		describe("given empty password", () => {
			it("should return 400 and error message", async () => {
				const user = {
					email: "test@test.com",
					password: "",
				};

				const { status, body } = await supertest(app)
					.post(`${registerURL}`)
					.send(user);

				expect(status).toBe(400);
				expect(body).toEqual({
					message: '"password" is not allowed to be empty',
				});
			});
		});

		describe("given invalid email", () => {
			it("should return 400 and error message", async () => {
				const user = {
					email: "test",
					passwoentitisrd: "123465789",
				};

				const { status, body } = await supertest(app)
					.post(`${registerURL}`)
					.send(user);

				expect(status).toBe(400);
				expect(body).toEqual({
					message: "Invalid Email",
				});
			});
		});

		describe("given invalid password", () => {
			it("should return 400 and error message", async () => {
				const user = {
					email: "test@test.com",
					password: "123",
				};

				const { status, body } = await supertest(app)
					.post(`${registerURL}`)
					.send(user);

				expect(status).toBe(400);
				expect(body).toEqual({
					message: "Invalid Password",
				});
			});
		});

		describe("given valid email and password", () => {
			const user = {
				email: "test@test.com",
				password: "123456789",
			};
			let cookie: string;

			it("should return 201 and return user id and email", async () => {
				const { status, body, header } = await supertest(app)
					.post(`${registerURL}`)
					.send(user);

				cookie = header["set-cookie"][0];

				expect(status).toEqual(201);
				expect(body.id).toEqual(1);
				expect(body.email).toEqual(user.email);
				expect(body.password).toBeUndefined();
			});

			it("should saves the password hashed into the DB", async () => {
				const query = await AppDataSource.query(
					"select password from users where id = 1"
				);

				const savedPassword = query[0].password;
				const hashed = await unhashStr(user.password, savedPassword);

				expect(hashed).toBeTruthy();
			});

			it("should create session and save cookie", async () => {
				const cookiePrefix = cookie.slice(0, 3);
				expect(cookiePrefix).toEqual("qid");
			});
		});

		describe("given email already exists", () => {
			it("should return 409 and error message", async () => {
				const user = {
					email: "test@test.com",
					password: "123465798",
				};

				const { status, body } = await supertest(app)
					.post(`${registerURL}`)
					.send(user);

				expect(status).toEqual(409);
				expect(body).toEqual({
					message: "Email already exists",
				});
			});
		});
	});

	describe("Login", () => {
		describe("given empty inputs", () => {
			it("should return 400 and error message", async () => {
				const user = {
					email: "",
					password: "",
				};

				const { status, body } = await supertest(app)
					.post(`${loginURL}`)
					.send(user);

				expect(status).toBe(400);
				expect(body).toEqual({
					message: '"email" is not allowed to be empty',
				});
			});
		});

		describe("given empty email", () => {
			it("should return 400 and error message", async () => {
				const user = {
					email: "",
					password: "123456798",
				};

				const { status, body } = await supertest(app)
					.post(`${loginURL}`)
					.send(user);

				expect(status).toBe(400);
				expect(body).toEqual({
					message: '"email" is not allowed to be empty',
				});
			});
		});

		describe("given empty password", () => {
			it("should return 400 and error message", async () => {
				const user = {
					email: "test@test.com",
					password: "",
				};

				const { status, body } = await supertest(app)
					.post(`${loginURL}`)
					.send(user);

				expect(status).toBe(400);
				expect(body).toEqual({
					message: '"password" is not allowed to be empty',
				});
			});
		});

		describe("given email not registered", () => {
			it("should return 400 and error message", async () => {
				const user = {
					email: "fake@test.com",
					password: "123456789",
				};

				const { status, body } = await supertest(app)
					.post(`${loginURL}`)
					.send(user);

				expect(status).toBe(404);
				expect(body).toEqual({
					message: "User not found",
				});
			});
		});

		describe("given email not registered but wrong password", () => {
			it("should return 400 and error message", async () => {
				const user = {
					email: "test@test.com",
					password: "1234567890",
				};

				const { status, body } = await supertest(app)
					.post(`${loginURL}`)
					.send(user);

				expect(status).toBe(400);
				expect(body).toEqual({
					message: "Wrong password",
				});
			});
		});

		describe("given valid email and password", () => {
			it("should return 400 and error message", async () => {
				const user = {
					email: "test@test.com",
					password: "123456789",
				};

				const { status, body } = await supertest(app)
					.post(`${loginURL}`)
					.send(user);

				expect(status).toBe(200);
				expect(body).toEqual({
					id: 1,
					email: user.email,
				});
			});
		});
	});
});
