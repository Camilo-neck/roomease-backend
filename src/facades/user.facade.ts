import { Request, Response } from "express";

import { ServerError } from "@/errors/server.error";
import { STATUS_CODES } from "@/utils/constants";

import houseModel from "../db/models/house.model";
import userModel from "../db/models/user.model";

class UserFacade {
	public async listUsers(req: Request, res: Response): Promise<Response | undefined> {
		const users = await userModel.find();
		return res.status(STATUS_CODES.OK).json(users);
	}

	public async profile(req: Request, res: Response): Promise<Response | undefined> {
		const user = await userModel.findById(req.userId, { password: 0 });
		return res.status(STATUS_CODES.OK).json(user);
	}

	public async getHouses(req: Request, res: Response): Promise<Response | undefined> {
		const houses = await houseModel
			.find(
				{ users: req.userId },
				{
					name: 1,
					house_code: 1,
					description: 1,
					house_picture: 1,
					address: 1,
					users: 1,
				},
			)
			.populate("users", { _id: 0, name: 1, profile_picture: 1 });

		return res.status(STATUS_CODES.OK).json(houses);
	}

	public async getInfo(req: Request, res: Response): Promise<Response | undefined> {
		const user = await userModel.findById(req.params.id, { password: 0 });
		if (!user) throw new ServerError("User not found", STATUS_CODES.NOT_FOUND);

		return res.status(STATUS_CODES.OK).json(user);
	}

	public async update(req: Request, res: Response): Promise<Response | undefined> {
		const { id } = req.params;
    	const updatedUser = await userModel.findByIdAndUpdate(id, req.body, { new: true, });

		if (!updatedUser) {
		return res.status(STATUS_CODES.NOT_FOUND).json({
			message: "User not found",
		});
		}

    	return res.status(STATUS_CODES.OK).json({message: "User updated", updatedUser});
	}

	public async delete(req: Request, res: Response): Promise<Response | undefined> {
		const userId: string = req.params.id;
		await userModel.deleteOne({ _id: userId });

		await houseModel.updateMany({ $pull: { users: userId } });
		return res.status(STATUS_CODES.OK).json({ message: "User deleted" });
	}
}

export default new UserFacade();
