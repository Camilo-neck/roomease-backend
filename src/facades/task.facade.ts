import { Request, Response } from "express";
import { Types } from "mongoose";

import { ServerError } from "@/errors/server.error";
import notificationFacade from "@/facades/notification.facade";
import { NOTIFICATION_TYPES, STATUS_CODES } from "@/utils/constants";

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

			tasks = get_week_tasks(tasks);
		}

		//change users_id to users
		tasks = tasks.map((task: any) => {
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

		await taskModel.findOneAndUpdate({ _id: id }, updateTask, { new: true });

		return res.status(STATUS_CODES.OK).json({ message: "Task updated" });
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

		if (task.done) {
			notificationFacade.create({
				type: NOTIFICATION_TYPES.COMPLETED_TASK,
				recipient: task.users_id[0],
				house_id: task.house_id,
				is_read: false,
				task_name: task.name,
			});
		}

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

const get_week_tasks = (tasks: any[]) => {
	const today = new Date();
	const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

	return tasks.filter((task: any) => {
		const t_date = task.until_date ? task.until_date : task.end_date;
		const taskDate = new Date(t_date);
		return taskDate >= firstDayOfWeek;
	});
};

export default new TaskFacade();
