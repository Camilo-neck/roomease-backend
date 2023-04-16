import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";

import errorMiddleware from "@/middlewares/error.middleware";
import authRoutes from "@/routes/auth.routes";
import helloRoutes from "@/routes/hello.routes";
import houseRoutes from "@/routes/house.routes";
import taskRoutes from "@/routes/task.routes";
import userRoutes from "@/routes/user.routes";
import {
	AUTH_ROUTES,
	HOUSE_ROUTES,
	TASK_ROUTES,
	USER_ROUTES,
} from "@/utils/constants";

export class App {
	private readonly _app: Application;

	constructor() {
		this._app = express();
		this.initMiddlewares();
	}

	private initMiddlewares() {
		this._app.use(cors());
		this._app.use(helmet());
		this._app.use(morgan("dev"));
		this._app.use(express.json());
		this._app.use(express.urlencoded({ extended: true }));

		this._app.use("/", helloRoutes);
		this._app.use(AUTH_ROUTES.PEFIX, authRoutes);
		this._app.use(USER_ROUTES.PREFIX, userRoutes);
		this._app.use(HOUSE_ROUTES.PREFIX, houseRoutes);
		this._app.use(TASK_ROUTES.PREFIX, taskRoutes);

		this._app.use(errorMiddleware);
	}

	public get app(): Application {
		return this._app;
	}
}
