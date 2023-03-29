import { loginSchema, registerSchema } from "./authRouteSchemas";
import {
	createHouseSchema,
	handleJoinSchema,
	updateHouseSchema,
} from "./houseRouteSchemas";

export const RouteSchemas: any = {
	"/register": registerSchema,
	"/login": loginSchema,

	"/house/create": createHouseSchema,
	"/house/update": updateHouseSchema,
	"/house/handleJoin": handleJoinSchema,
};
