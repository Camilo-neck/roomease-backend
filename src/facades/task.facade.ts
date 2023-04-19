import { Request, Response } from "express";

import { STATUS_CODES } from "@/utils/constants";

import houseModel from "../db/models/house.model";
import taskModel from "../db/models/task.model";
import userModel from "../db/models/user.model";

class TaskFacade {
	public async getByHouse(req: Request, res: Response): Promise<Response> {
		// pass
		return res.status(STATUS_CODES.NO_CONTENT).json({ message: "No content" });
	}
	public async getByUser(req: Request, res: Response): Promise<Response> {
		// pass
		return res.status(STATUS_CODES.NO_CONTENT).json({ message: "No content" });
	}
	public async create(req: Request, res: Response): Promise<Response | undefined> {
		const { users_id } = req.body;

		//check if users exist
		const users = await userModel.find({ _id: { $in: users_id } });
		if (users.length !== users_id.length) {
			throw new Error("Invalid users, one or more users does not exist");
		}

		//check if users belong to the house
		const house = req.house;
		if (!users_id.every((user_id: string) => house.users.includes(user_id))) {
			throw new Error("Invalid users, one or more users does not belong to the house");
		}

		const taskData = req.body;
		taskData["house_id"] = house._id;
		taskData["created_by"] = req.userId;
		taskData["done"] = false;

		const task = new taskModel(taskData);

		await task.save();

		const u = await userModel.find({ _id: { $in: taskData.users_id } });

		u.forEach((user) => {
			user.events.push(task._id.toString());
			user.save();
		});

		return res.status(STATUS_CODES.CREATED).json({
			message: "Task created successfully",
			_id: task._id.toString(),
		});
	}
	public async update(req: Request, res: Response): Promise<Response | undefined> {
		// pass
		return res.status(STATUS_CODES.NO_CONTENT).json({ message: "No content" });
	}

	public async delete(req: Request, res: Response): Promise<Response | undefined> {
		const taskId: string = req.params.id;

		const task = await taskModel.findById(taskId);
		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}  

		await taskModel.deleteOne({ _id: taskId });
		await userModel.updateMany({ $pull: { events: taskId } });
		return res.status(STATUS_CODES.OK).json({ message: "Task deleted" });
	}

	public async done(req: Request, res: Response): Promise<Response | undefined> {
		// pass
		return res.status(STATUS_CODES.NO_CONTENT).json({ message: "No content" });
	}

	public async list(req: Request, res: Response): Promise<Response | undefined> {
		const tasks = await taskModel.find();
		return res.status(STATUS_CODES.OK).json(tasks);
	}
}

export default new TaskFacade();
