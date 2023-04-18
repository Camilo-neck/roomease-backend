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
		this._app.use("/", authRoutes);
		this._app.use("/user", userRoutes);
		this._app.use("/house", houseRoutes);
		this._app.use("/task", taskRoutes);

		this._app.use(errorMiddleware);
	}

	public get app(): Application {
		return this._app;
	}
}
