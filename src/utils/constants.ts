export enum STATUS_CODES {
	OK = 200,
	CREATED = 201,
	NO_CONTENT = 204,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	INTERNAL_ERROR = 500,
}

export const AUTH_ROUTES = {
	PEFIX: "/",

	REGISTER: "/register",
	LOGIN: "/login",
};

export const HOUSE_ROUTES = {
	PREFIX: "/house",

	LIST: "/list",
	CREATE: "/create",
	UPDATE: "/update",
	DELETE: "/delete",
	JOIN: "/join",
	HANDLE_JOIN: "/handleJoin",
};

export const USER_ROUTES = {
	PREFIX: "/user",

	LIST: "/list",
	PROFILE: "/profile",
	HOUSES: "/houses",
	GET_INFO: "/getInfo/:id",
};
