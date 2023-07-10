import type { Request } from "express";

export interface IUser {
	email: string;
	password: string;
}

export interface RegisterRequest extends Request {
	body: {
		email: string;
		password: string;
	};
}

export interface LoginRequest extends Request {
	body: {
		email: string;
		password: string;
	};
}
