import { STATUS_CODES } from "../utils/constants";

export class ServerError extends Error {
	private readonly _code: STATUS_CODES;
	constructor(message: string, code: STATUS_CODES) {
		super(message);

		if (!code) code = STATUS_CODES.INTERNAL_ERROR;
		this._code = code;
	}

	public get code(): number {
		return this._code;
	}
}
