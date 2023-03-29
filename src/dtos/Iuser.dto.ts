export interface IUser extends Document {
	username: string;
	email: string;
	password: string;
	birth_date: Date;
	phone: string;
	description: string;
	profile_picture: string;
	tags: string[];
	scores: string[];
	events: string[];
	houses: string[];
	encryptPassword(password: string): Promise<string>;
	validatePassword(password: string): Promise<boolean>;
}
