import { Request, Response } from "express";
import { Document, ObjectId, Types } from "mongoose";

import houseModel from "../db/models/house.model";
import taskModel from "../db/models/task.model";
import userModel from "../db/models/user.model";
import { IHouse } from "../dtos/Ihouse.dto";
import { ITask } from "../dtos/ITask.dto";
import { IUser } from "../dtos/Iuser.dto";
import { ServerError } from "../errors/server.error";
import { NOTIFICATION_TYPES, STATUS_CODES } from "../utils/constants";
import { create_notifications } from "./notification.facade";

class TaskFacade {
	// public async get(req: Request, res: Response): Promise<Response> {
	// 	const { user_id, house_id } = req.query;
	// 	let tasks: Document<ITask>[] | undefined = undefined;

	// 	if (user_id === undefined) {
	// 		tasks = await taskModel.find({ house_id: house_id }).populate({
	// 			path: "users_id",
	// 			select: "name email profile_picture",
	// 		});
	// 	} else {
	// 		tasks = await taskModel.find({ house_id: house_id, users_id: user_id }).populate({
	// 			path: "users_id",
	// 			select: "name email profile_picture",
	// 		});

	// 		tasks = get_week_tasks(tasks);
	// 	}

	// 	//change users_id to users
	// 	tasks = tasks.map((task: Document<ITask>) => {
	// 		const taskObj = task.toObject();
	// 		taskObj["users"] = taskObj["users_id"];
	// 		delete taskObj["users_id"];
	// 		return taskObj;
	// 	});

	// 	return res.status(STATUS_CODES.OK).json(tasks);
	// }

	public async get(req: Request, res: Response): Promise<Response> {
		const { user_id, house_id } = req.query;
		let tasks: Document<ITask>[] | undefined = undefined;


		if (user_id !== undefined) {
			// Obtener las tareas filtrando por house_id y users_id
			tasks = await taskModel.find({ house_id: house_id, users_id: user_id });
		} else {
			// Obtener todas las tareas filtrando solo por house_id
			tasks = await taskModel.find({ house_id: house_id });
		}

		console.log("a");
		

		tasks = get_week_tasks(tasks);

		console.log(tasks);

		// Cambiar users_id a users
		tasks = tasks.map((task: Document<ITask>) => {
			const taskObj = task.toObject();
			taskObj.users = taskObj.users_id;
			delete taskObj.users_id;
			return taskObj;
		});

		return res.status(STATUS_CODES.OK).json(tasks);
	}

	public async create(req: Request, res: Response): Promise<Response | undefined> {
		const { users_id } = req.body;

		const users: Document<IUser>[] = await validate_users(users_id, req.house);

		const taskData: ITask = req.body;
		taskData["created_by"] = req.userId;
		taskData["done"] = false;

		if (!taskData.until_date) {
			taskData["until_date"] = taskData.end_date;
		}

		const task = new taskModel(taskData);

		await task.save();

		//CREATE NOTIFICATION
		await create_notifications({
			type: NOTIFICATION_TYPES.ASSIGNED_TASK,
			recipients: users.map((user: any) => user._id),
			house_name: req.house.name,
			task_name: task.name,
		});

		return res.status(STATUS_CODES.CREATED).json({
			message: "Task created successfully",
			_id: task._id.toString(),
		});
	}
	public async update(req: Request, res: Response): Promise<Response | undefined> {
		const { id } = req.params;
		const updateTask: ITask = req.body;

		await validate_task(id, req.userId);
		await validate_users(updateTask.users_id, req.house);

		console.log("Hola");

		await taskModel.findOneAndUpdate({ _id: id }, updateTask, { new: true });

		return res.status(STATUS_CODES.OK).json({ message: "Task updated" });
	}

	public async delete(req: Request, res: Response): Promise<Response | undefined> {
		const taskId = req.params.id;
		const userId = req.userId;

		await validate_task(taskId, userId);

		await taskModel.findOneAndDelete({ _id: taskId });

		return res.status(STATUS_CODES.OK).json({ message: "Task deleted" });
	}

	public async done(req: Request, res: Response): Promise<Response | undefined> {
		const taskId = req.params.id;
		const userId = req.userId;

		const { task } = await validate_task(taskId, userId);

		task.done = !task.done;
		task.save();

		//CREATE NOTIFICATION

		const users: Document<IUser>[] = await userModel.find({ _id: { $in: task.users_id } });
		const house = await houseModel.findById(task.house_id);
		if (task.done) {
			await create_notifications({
				type: NOTIFICATION_TYPES.COMPLETED_TASK,
				recipients: users.map((user: any) => user._id),
				house_name: house?.name,
				task_name: task.name,
			});
		}

		return res.status(STATUS_CODES.OK).json({ message: `Task marked as ${task.done ? "done" : "undone"}` });
	}

	public async list(req: Request, res: Response): Promise<Response | undefined> {
		const tasks: Document<ITask>[] = await taskModel.find();
		return res.status(STATUS_CODES.OK).json(tasks);
	}
}

/////////////

async function validate_users(users_id: ObjectId[], house: any = undefined): Promise<any> {
	const users = await userModel.find({ _id: { $in: users_id } });
	if (users.length !== users_id.length) {
		throw new ServerError("Invalid users, one or more users does not exist", STATUS_CODES.BAD_REQUEST);
	}

	if (house) {
		if (!users_id.every((user_id: ObjectId) => house.users.includes(user_id))) {
			throw new ServerError("Invalid users, one or more users does not belong to the house", STATUS_CODES.BAD_REQUEST);
		}
	}

	return users;
}

async function validate_task(task_id: string, user_id: string): Promise<any> {
	if (!Types.ObjectId.isValid(task_id)) {
		throw new ServerError("Invalid task id", STATUS_CODES.BAD_REQUEST);
	}

	const user = await userModel.findById(user_id);
	if (!user) {
		throw new ServerError("User not found", STATUS_CODES.BAD_REQUEST);
	}
	const task = await taskModel.findById({ _id: task_id });
	if (!task) {
		throw new ServerError("Task not found", STATUS_CODES.BAD_REQUEST);
	}

	return { task, user };
}

const get_week_tasks = (tasks: Document<ITask>[]): Document<ITask>[] => {
	const today: Date = new Date();
	const firstDayOfWeek: Date = new Date(today.setDate(today.getDate() - today.getDay()));

	return tasks.filter((task: any) => {
		const t_date: Date = task.until_date ? task.until_date : task.end_date;
		const taskDate: Date = new Date(t_date);
		return taskDate >= firstDayOfWeek;
	});
};

export default new TaskFacade();
