import { ObjectSchema } from "joi";

import { AUTH_ROUTES, HOUSE_ROUTES, USER_ROUTES } from "../constants";
import { loginSchema, registerSchema } from "./authRouteSchemas";
import {
	createHouseSchema,
	handleJoinSchema,
	updateHouseSchema,
} from "./houseRouteSchemas";

export const RouteSchemas: Record<string, ObjectSchema> = {
	[AUTH_ROUTES.REGISTER]: registerSchema,
	[AUTH_ROUTES.LOGIN]: loginSchema,

	[HOUSE_ROUTES.PREFIX + HOUSE_ROUTES.CREATE]: createHouseSchema,
	[HOUSE_ROUTES.PREFIX + HOUSE_ROUTES.UPDATE]: updateHouseSchema,
	[HOUSE_ROUTES.PREFIX + HOUSE_ROUTES.HANDLE_JOIN]: handleJoinSchema,
};
