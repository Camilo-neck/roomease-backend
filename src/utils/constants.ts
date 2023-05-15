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

export enum FIELD_TYPES {
	BODY = "body",
	QUERY = "query",
	PARAMS = "params",
}

export enum NOTIFICATION_TYPES {
	ACCEPTED_JOIN = "accepted_join",
	REJECTED_JOIN = "rejected_join",
	REQUEST_JOIN = "request_join", // llega a owner
	ASSIGNED_TASK = "assigned_task",
	COMPLETED_TASK = "completed_task",
	USER_KICKED = "user_kicked",
}
