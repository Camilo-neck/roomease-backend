import { Request, Response } from "express";
import { Types } from "mongoose";

import { ServerError } from "@/errors/server.error";
import { STATUS_CODES } from "@/utils/constants";

import taskModel from "../db/models/task.model";
import userModel from "../db/models/user.model";

class TaskFacade {
	public async get(req: Request, res: Response): Promise<Response> {
		const { user_id, house_id } = req.query;
		let tasks = undefined;

		if (user_id === undefined) {
			tasks = await taskModel.find({ house_id: house_id }).populate({
				path: "users_id",
				select: "name email",
			});
		} else {
			tasks = await taskModel.find({ house_id: house_id, users_id: user_id }).populate({
				path: "users_id",
				select: "name email",
			});
		}

		//change users_id to users
		tasks = tasks.map((task) => {
			const taskObj: any = task.toObject();
			taskObj["users"] = taskObj["users_id"];
			delete taskObj["users_id"];
			return taskObj;
		});

		return res.status(STATUS_CODES.OK).json(tasks);
	}

	public async create(req: Request, res: Response): Promise<Response | undefined> {
		const { users_id } = req.body;

		await validate_users(users_id, req.house);

		const taskData = req.body;
		taskData["created_by"] = req.userId;
		taskData["done"] = false;

		if (!taskData.until_date) {
			taskData["until_date"] = taskData.end_date;
		}

		const task = new taskModel(taskData);

		await task.save();

		return res.status(STATUS_CODES.CREATED).json({
			message: "Task created successfully",
			_id: task._id.toString(),
		});
	}
	public async update(req: Request, res: Response): Promise<Response | undefined> {
		const { id } = req.params;
		const updateTask = req.body;

		await validate_task(id, req.userId);
		await validate_users(updateTask.users_id, req.house);

		// const task = await taskModel.findByIdAndUpdate(id, updateTask, { new: true });
		const task = await taskModel.findOneAndUpdate({ _id: id }, updateTask, { new: true });

		if (!task) {
			throw new ServerError("Task not found", STATUS_CODES.BAD_REQUEST);
		}

		return res.status(STATUS_CODES.OK).json({ message: "Task updated", task });
	}

	public async delete(req: Request, res: Response): Promise<Response | undefined> {
		const taskId: string = req.params.id;
		const userId = req.userId;

		await validate_task(taskId, userId);

		await taskModel.findOneAndDelete({ _id: taskId });

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

	if (!user?.tasks.includes(task_id)) {
		throw new ServerError("The user does not have that task", STATUS_CODES.BAD_REQUEST);
	}

	return task;
}
export default new TaskFacade();
