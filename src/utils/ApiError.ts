class ApiError {
	code: number;
	msg: string;

	constructor(code: number, msg: string) {
		this.code = code;
		this.msg = msg;
	}

	static badRequest = (msg: string) => {
		return new ApiError(400, msg);
	};

	static notFound = (msg: string) => {
		return new ApiError(404, msg);
	};

	static conflict = (msg: string) => {
		return new ApiError(409, msg);
	};

	static internal = (msg: string) => {
		return new ApiError(500, msg);
	};
}

export default ApiError;
