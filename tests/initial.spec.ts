import request from "supertest";
import { App } from "../src/app";

import mongoose from "mongoose";
import dbConnect from "../src/db/dbConnect";

const app = new App().app;

beforeAll(() => {
	dbConnect();
});

/* 
POST /login
{
	email: "juanTorres@gmail.com"
	password: "12345"
}

Expect:
	200
	"auth-token" : token (header)

Then

GET houses/641e352b3555d5aadb2cc786
auth-token: token (header)

Expect:
	401
	{"message" : "User not belongs to this house"}
*/

describe("Test belongsToHouse middleware", () => {
	let token: string;

	beforeAll(async () => {
		const response = await request(app)
			.post("/login")
			.send({
				email: "juanTorres@gmail.com",
				password: "12345",
			});
		token = response.header["auth-token"];
	}
	);

	it("Should return 400 if user not belongs to house", async () => {
		const response = await request(app)
			.get("/houses/641e352b3555d5aadb2cc786")
			.set("auth-token", token);

		expect(response.status).toBe(400);
		expect(response.body.message).toBe("User not belongs to this house");
	});
});

describe("Test view house needs auth-token", () => {

	it("Should return 401 if auth-token is noy provided", async () => {
		const response = await request(app)
			.get("/houses/641e352b3555d5aadb2cc786")

		expect(response.status).toBe(401);
		expect(response.body.message).toBe("No token provided");
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});