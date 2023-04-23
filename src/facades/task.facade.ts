import { Request, Response } from "express";

import { ServerError } from "@/errors/server.error";
import { STATUS_CODES } from "@/utils/constants";

import taskModel from "../db/models/task.model";
import userModel from "../db/models/user.model";

class TaskFacade {
	public async get(req: Request, res: Response): Promise<Response> {
		const { user_id, house_id } = req.query;
		let task = undefined;

		if (user_id === undefined) {
			task = await taskModel.find({ house_id: house_id });
		} else {
			task = await taskModel.find({ house_id: house_id, users_id: user_id });
		}

		return res.status(STATUS_CODES.OK).json(task);
	}

	public async create(req: Request, res: Response): Promise<Response | undefined> {
		const { users_id } = req.body;

		await validate_users(users_id, req.house);

		const taskData = req.body;
		taskData["created_by"] = req.userId;
		taskData["done"] = false;

		const task = new taskModel(taskData);

		await task.save();
		await userModel.updateMany({ _id: { $in: users_id } }, { $push: { tasks: task._id.toString() } });

		return res.status(STATUS_CODES.CREATED).json({
			message: "Task created successfully",
			_id: task._id.toString(),
		});
	}
	public async update(req: Request, res: Response): Promise<Response | undefined> {
		const { task_id } = req.params;
		const updateTask = req.body;

		await validate_task(task_id, req.userId);
		await validate_users(updateTask.users_id, req.house);

		const task = await taskModel.findByIdAndUpdate(task_id, updateTask, { new: true });

		if (!task) {
			throw new ServerError("Task not found", STATUS_CODES.BAD_REQUEST);
		}

		//Modificar lista de tareas de los usuarios
		await userModel.updateMany({ $pull: { tasks: task_id } });
		await userModel.updateMany({ _id: { $in: task.users_id } }, { $push: { tasks: task._id.toString() } });

		return res.status(STATUS_CODES.OK).json({ message: "Task updated", task });
	}

	public async delete(req: Request, res: Response): Promise<Response | undefined> {
		const taskId: string = req.params.id;
		const userId = req.userId;

		await validate_task(taskId, userId);

		await taskModel.findByIdAndDelete(taskId);
		await userModel.updateMany({ $pull: { tasks: taskId } });

		return res.status(STATUS_CODES.OK).json({ message: "Task deleted" });
	}

	public async done(req: Request, res: Response): Promise<Response | undefined> {
		const taskId: string = req.params.id;
		const userId = req.userId;

		const task = await validate_task(taskId, userId);

		task.done = !task.done;
		task.save();

		return res.status(STATUS_CODES.OK).json({ message: `Task marked as ${task.done ? "done" : "undone"}` });
	}

	public async list(req: Request, res: Response): Promise<Response | undefined> {
		const tasks = await taskModel.find();
		return res.status(STATUS_CODES.OK).json(tasks);
	}
}

/////////////

async function validate_users(users_id: string[], house: any = undefined): Promise<any> {
	const users = await userModel.find({ _id: { $in: users_id } });
	if (users.length !== users_id.length) {
		throw new ServerError("Invalid users, one or more users does not exist", STATUS_CODES.BAD_REQUEST);
	}

	if (house) {
		if (!users_id.every((user_id: string) => house.users.includes(user_id))) {
			throw new ServerError("Invalid users, one or more users does not belong to the house", STATUS_CODES.BAD_REQUEST);
		}
	}

	return users;
}

async function validate_task(task_id: string, user_id: string): Promise<any> {
	const user = await userModel.findById(user_id);
	if (!user) {
		throw new ServerError("User not found", STATUS_CODES.BAD_REQUEST);
	}
	const task = await taskModel.findById(task_id);
	if (!task) {
		throw new ServerError("Task not found", STATUS_CODES.BAD_REQUEST);
	}

	if (!user?.tasks.includes(task_id)) {
		throw new ServerError("The user does not have that task.", STATUS_CODES.BAD_REQUEST);
	}

	return task;
}
export default new TaskFacade();
