class ApiSuccess {
	code: number;
	msg: string;

	constructor(code: number, msg: string) {
		this.code = code;
		this.msg = msg;
	}

	static created = (msg: string) => {
		return new ApiSuccess(201, msg);
	};
}

export default ApiSuccess;
