import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { ServerError } from "@/errors/server.error";
import { STATUS_CODES } from "@/utils/constants";

import houseModel from "../db/models/house.model";
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

		//check if users exist
		const users = await userModel.find({ _id: { $in: users_id } });
		if (users.length !== users_id.length) {
			throw new ServerError("Invalid users, one or more users does not exist", STATUS_CODES.BAD_REQUEST);
		}

		//check if users belong to the house
		const house = req.house;
		if (!users_id.every((user_id: string) => house.users.includes(user_id))) {
			throw new ServerError("Invalid users, one or more users does not belong to the house", STATUS_CODES.BAD_REQUEST);
		}

		const taskData = req.body;
		taskData["created_by"] = req.userId;
		taskData["done"] = false;

		const task = new taskModel(taskData);

		await task.save();

		users.forEach((user) => {
			user.tasks.push(task._id.toString());
			user.save();
		});

		//userModel.updateMany({ _id: { $in: users_id } }, { $push: { tasks: task._id.toString() } });

		return res.status(STATUS_CODES.CREATED).json({
			message: "Task created successfully",
			_id: task._id.toString(),
		});
	}
	public async update(req: Request, res: Response): Promise<Response | undefined> {
		const { id } = req.params;
		const updateTask = req.body;
		const task = await taskModel.findByIdAndUpdate(id, updateTask, { new: true });

		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}

		//Modificar lista de tareas de los usuarios
		await userModel.updateMany({ $pull: { tasks: id } });
		const users = await userModel.find({ _id: { $in: task.users_id } });
		users.forEach((user) => {
			user.tasks.push(task._id.toString());
			user.save();
		});

		return res.status(STATUS_CODES.OK).json({ message: "Task updated", task });
	}

	public async delete(req: Request, res: Response): Promise<Response | undefined> {
		const taskId: string = req.params.id;
		const userId = req.userId;

		const task = await taskModel.findById(taskId);
		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}

		const user = await userModel.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		if (!user.tasks.includes(taskId)) {
			return res.status(404).json({ message: "The user does not have that task." });
		}
		await taskModel.findByIdAndDelete(taskId);
		await userModel.updateMany({ $pull: { tasks: taskId } });
		return res.status(STATUS_CODES.OK).json({ message: "Task deleted" });
	}

	public async done(req: Request, res: Response): Promise<Response | undefined> {
		const taskId: string = req.params.id;
		const userId = req.userId;

		const task = await taskModel.findById(taskId);
		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}

		const user = await userModel.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		if (!user.tasks.includes(taskId)) {
			return res.status(404).json({ message: "The user does not have that task." });
		}
		task.done = true;
		task.save();

		return res.status(STATUS_CODES.OK).json({ message: "Task marked as done" });
	}

	public async list(req: Request, res: Response): Promise<Response | undefined> {
		const tasks = await taskModel.find();
		return res.status(STATUS_CODES.OK).json(tasks);
	}
}

export default new TaskFacade();
