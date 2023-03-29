export interface IHouse extends Document {
	name: string;
	owner: string;
	house_code: string;
	description: string;
	house_picture: string;
	address: string;
	tags: string[];
	users: string[];
	pending_users: string[];
}
