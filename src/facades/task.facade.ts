import { Request, Response } from "express";

import { STATUS_CODES } from "@/utils/constants";

import houseModel from "../models/house.model";
import taskModel from "../models/task.model";
import userModel from "../models/user.model";

class TaskFacade {
	async getByHouse(req: Request, res: Response) {
		// pass
		return res.status(STATUS_CODES.NO_CONTENT).json({ message: "No content" });
	}
	async getByUser(req: Request, res: Response) {
		// pass
		return res.status(STATUS_CODES.NO_CONTENT).json({ message: "No content" });
	}
	async create(req: Request, res: Response) {
		// example
		// {
		//     "name": "Tarea 1",
		//     "description": "Descripcion tarea 1",
		//     "house_id": "641e352b3555d5aadb2cc786",
		//     "users_id": [
		//         "641e16843f0f760f0fd0fccf"
		//     ],
		//     "days": ["LUNES", "MIERCOLES"],
		//     "hours": {
		//         "start": "10:00",
		//         "end": "12:00"
		//     },
		//     "repeat": true,
		//     "from_date": "2020-10-30T00:00:00.000Z",
		//     "to_date": "2020-11-30T00:00:00.000Z"
		// }
		try {
			const {
				name,
				description,
				house_id,
				users_id,
				days,
				hours,
				repeat,
				from_date,
				to_date,
			} = req.body;

			//check if users exist
			const users = await userModel.find({ _id: { $in: users_id } });
			if (users.length !== users_id.length) {
				return res.status(STATUS_CODES.BAD_REQUEST).json({
					message: "Invalid users, one or more users does not exist",
				});
			}

			//check if users belong to the house
			const house = req.house;
			if (!users_id.every((user_id: string) => house.users.includes(user_id))) {
				return res.status(STATUS_CODES.BAD_REQUEST).json({
					message:
						"Invalid users, one or more users does not belong to the house",
				});
			}

			const taskData = {
				name,
				description,
				house_id,
				users_id,
				done: false,
				created_by: req.userId,
				days,
				hours,
				repeat,
				from_date,
				to_date,
			};

			const task = new taskModel(taskData);
			await task.save();

			return res.status(STATUS_CODES.CREATED).json({
				message: "Task created successfully",
				_id: task._id.toString(),
			});
		} catch (error) {
			console.error(error);
			return res
				.status(STATUS_CODES.INTERNAL_ERROR)
				.json({ message: "Internal server error" });
		}
	}
	async update(req: Request, res: Response) {
		// pass
		return res.status(STATUS_CODES.NO_CONTENT).json({ message: "No content" });
	}
	async delete(req: Request, res: Response) {
		// pass
		return res.status(STATUS_CODES.NO_CONTENT).json({ message: "No content" });
	}
	async done(req: Request, res: Response) {
		// pass
		return res.status(STATUS_CODES.NO_CONTENT).json({ message: "No content" });
	}

	async list(req: Request, res: Response) {
		try {
			const tasks = await taskModel.find();
			return res.status(STATUS_CODES.OK).json(tasks);
		} catch (error) {
			console.error(error);
			return res
				.status(STATUS_CODES.INTERNAL_ERROR)
				.json({ message: "Internal server error" });
		}
	}
}

export default new TaskFacade();
